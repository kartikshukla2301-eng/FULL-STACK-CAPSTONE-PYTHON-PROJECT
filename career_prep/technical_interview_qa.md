# 🎯 Technical Interview Preparation - Python & System Design Q&A

Comprehensive reference containing 25+ real-world Python, Web Framework, Database, and System Design interview questions with model answers.

---

## 🐍 Core Python & Advanced Language Features

### Q1: What is the difference between `asyncio` (async/await) and multithreading in Python? When would you use each?
**Answer**:
- `asyncio` provides single-threaded single-process cooperative multitasking using an event loop. It is ideal for I/O-bound operations (network requests, DB queries, WebSockets) because switching context does not involve OS kernel overhead.
- Multithreading (`threading` module) uses OS threads, but in CPython, execution is constrained by the Global Interpreter Lock (GIL), meaning only one thread executes Python bytecode at a time. Threads are suitable for I/O tasks requiring blocking C libraries.
- For CPU-bound tasks (image processing, data manipulation), `multiprocessing` or Celery distributed workers should be used to bypass the GIL.

---

### Q2: How do decorators work in Python, and how would you implement a rate-limiting decorator?
**Answer**:
A decorator is a callable that takes another function as an argument and extends its behavior without modifying its source code (implementing the Decorator pattern via closures).

```python
import functools
import time
from fastapi import HTTPException

def rate_limit(max_calls: int, period: int):
    calls = []
    def decorator(func):
        @functools.wraps(func)
        async def wrapper(*args, **kwargs):
            now = time.time()
            # Filter out calls older than the period window
            nonlocal calls
            calls = [c for c in calls if c > now - period]
            if len(calls) >= max_calls:
                raise HTTPException(status_code=429, detail="Rate limit exceeded")
            calls.append(now)
            return await func(*args, **kwargs)
        return wrapper
    return decorator
```

---

### Q3: Explain Python's Memory Management, Reference Counting, and Garbage Collection.
**Answer**:
- Python uses **Reference Counting** as its primary memory management mechanism. Every object has a reference count (`ob_refcnt`). When the count reaches 0, the memory is immediately deallocated.
- To handle **Cyclic References** (e.g., Object A references B, and B references A), CPython uses a generational **Garbage Collector** (Generations 0, 1, 2) that detects unreachable cycles using reference count inspection.

---

### Q4: What are Context Managers (`with` statement) and how do you write a custom async context manager?
**Answer**:
Context managers guarantee resource acquisition and release (e.g., DB transactions, file handles). In async Python, an async context manager defines `__aenter__` and `__aexit__`:

```python
class AsyncDBTransaction:
    def __init__(self, session):
        self.session = session

    async def __aenter__(self):
        return self.session

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if exc_type:
            await self.session.rollback()
        else:
            await self.session.commit()
```

---

## ⚡ Web Frameworks & Database Optimization

### Q5: How does FastAPI achieve higher performance compared to Flask or Django?
**Answer**:
FastAPI is built on top of **Starlette** (ASGI framework) and **Pydantic** (data parsing). Unlike WSGI frameworks (Flask/Django) that process requests synchronously in thread pools, FastAPI leverages Python's `async/await` syntax natively on Starlette's ASGI event loop (`uvicorn`), allowing thousands of concurrent idle connections per node.

---

### Q6: How do you solve the N+1 Query Problem in SQLAlchemy?
**Answer**:
The N+1 problem occurs when querying a parent table (N rows) and lazily loading child relationships in a loop, resulting in 1 query for parents + N queries for children.
In SQLAlchemy 2.0 async, it is solved using explicit join options:
- `selectinload()`: Fires 2 queries using an `IN (...)` clause (recommended for one-to-many).
- `joinedload()`: Performs a single `LEFT OUTER JOIN` (recommended for many-to-one).

---

## 🏗️ System Design & Architecture Questions

### Q7: How would you scale WebSocket connections to 100,000 concurrent users across multiple backend servers?
**Answer**:
A single server cannot maintain 100k open TCP connections due to file descriptor and socket limits.
1. **Load Balancing**: Place an Nginx / AWS ALB with Layer 7 WebSocket upgrade support in front of an auto-scaling backend cluster.
2. **Pub/Sub Broker**: Use **Redis Pub/Sub** or NATS as an event bus backplane. When a user updates a task on Instance A, Instance A publishes the event to Redis. All instances subscribed to that channel receive the message and broadcast it to their locally connected WebSocket clients.

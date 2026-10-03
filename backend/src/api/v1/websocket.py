from typing import List, Dict
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter(prefix="/ws", tags=["Realtime WebSocket"])

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, room_id: str, websocket: WebSocket):
        await websocket.accept()
        if room_id not in self.active_connections:
            self.active_connections[room_id] = []
        self.active_connections[room_id].append(websocket)

    def disconnect(self, room_id: str, websocket: WebSocket):
        if room_id in self.active_connections:
            if websocket in self.active_connections[room_id]:
                self.active_connections[room_id].remove(websocket)
            if not self.active_connections[room_id]:
                del self.active_connections[room_id]

    async def broadcast_to_room(self, room_id: str, message: dict):
        if room_id in self.active_connections:
            for connection in self.active_connections[room_id]:
                await connection.send_json(message)

ws_manager = ConnectionManager()

@router.websocket("/project/{project_id}")
async def websocket_endpoint(websocket: WebSocket, project_id: str):
    await ws_manager.connect(project_id, websocket)
    try:
        while True:
            data = await websocket.receive_json()
            # Broadcast update event to all subscribers in project room
            await ws_manager.broadcast_to_room(project_id, {
                "event": data.get("event", "task_updated"),
                "data": data.get("data", {}),
            })
    except WebSocketDisconnect:
        ws_manager.disconnect(project_id, websocket)

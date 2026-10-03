type Callback = (data: any) => void;

class WebSocketService {
  private socket: WebSocket | null = null;
  private callbacks: Callback[] = [];

  connect(projectId: number) {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}/api/v1/ws/project/${projectId}`;

    this.socket = new WebSocket(wsUrl);

    this.socket.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        this.callbacks.forEach((cb) => cb(parsed));
      } catch (err) {
        console.error('WebSocket parse error:', err);
      }
    };
  }

  onMessage(callback: Callback) {
    this.callbacks.push(callback);
  }

  send(data: any) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.callbacks = [];
  }
}

export const wsService = new WebSocketService();

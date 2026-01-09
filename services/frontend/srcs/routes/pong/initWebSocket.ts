
export function initWebSocket(uri: string, onMessage: (data: any) => void): WebSocket {
  const ws = new WebSocket(uri);

  ws.addEventListener("open", () => console.log("WebSocket on"));
  ws.addEventListener("error", (e) => {
    console.error("WebSocket error", e);
    window.location.href = "/lobby";
  }
  );

  ws.addEventListener("message", (e) => {
    const data = JSON.parse(e.data);
    onMessage(data);
  });

  return ws;
}

export function sendMessage(message: unknown, websocket: WebSocket | null): void {
  if (websocket && websocket.readyState === WebSocket.OPEN) {
    websocket.send(JSON.stringify(message));
    console.log("send message", message);
  }
  else {
    console.error("WebSocket is not open!!!!");
  }
}

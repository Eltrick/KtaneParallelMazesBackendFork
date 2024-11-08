import { SocketClient } from "./socket-client";

const clients: { [id: string]: SocketClient } = {};

declare global {
  interface ResponseInit {
    webSocket?: WebSocket | null;
  }
}

export default {
    async fetch(request: any, env: any, ctx: any) {
        return handleRequest(request);
    }
}

async function handleRequest(request: any) {
    const upgradeHeader = request.headers.get('Upgrade');
    if (!upgradeHeader || upgradeHeader !== 'websocket') {
        return new Response('Expected Upgrade: websocket', { status: 426 });
    }

    const wsp = new WebSocketPair();
    const [cli, srv] = Object.values(wsp);

    srv.accept();

    const client = new SocketClient(srv);
    clients[client.id] = client;
    client.onDisconnect(() => delete clients[client.id]);

    return new Response(null, {
        status: 101,
        webSocket: cli
    });
}
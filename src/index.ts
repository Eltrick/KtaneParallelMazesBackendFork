import { WebSocketServer } from "ws";

import { SocketClient } from "./socket-client";

const clients: { [id: string]: SocketClient } = {};

const port_num = Number(process.env.PORT) || 3000;
const wss = new WebSocketServer({ port: port_num });
console.log("Listening on port " + port_num.toString());

wss.on("connection", (ws: WebSocket) => {
	const client = new SocketClient(ws);
	clients[client.id] = client;
	client.onDisconnect(() => delete clients[client.id]);
});

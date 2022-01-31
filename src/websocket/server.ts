import { WebSocketServer } from "ws"
import { logger } from "../util";
import { Server } from "http";
import { handleConnection } from "./handlers/connection";
const log = logger({ name: "WebSocket Manager" })
export function createWebsocketServer(server: Server){
    const wss = new WebSocketServer({
        server,
        path: "/gateway"
    })
    
    wss.on("connection", (socket, request) => handleConnection(socket, request, log))
    wss.on("listening", () => log.info(`WebSocket Manager is live`))
    wss.on("close", () => log.warn(`Connection was closed`))

    return wss
}
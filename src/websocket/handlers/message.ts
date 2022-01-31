import WebSocket from "ws";
import { LoggerType } from "../../util";

export function handleMessage(socket: WebSocket, data: WebSocket.RawData, log: LoggerType){
    let payload: Payload
    try {
        payload = JSON.parse(data as unknown as string)
    } catch(e) {
        log.warn(`Unable to parse Data recieved from Client, disconnecting`)
        socket.send(JSON.stringify({ error: e }))
        return socket.close(1007)
    }

    if(!payload.auth || payload.auth != process.env.PAYLOAD_AUTH_KEY) {
        log.info(`Client sent no or an invalid Auth Param, Disconnecting`)
        return socket.close(1069)
    }
    console.log(`Recieved`, payload)
    return
}

interface Payload {
    auth: string
}
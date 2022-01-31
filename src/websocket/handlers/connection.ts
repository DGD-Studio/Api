import { IncomingMessage } from 'http'
import queryString from 'query-string'
import WebSocket from 'ws'
import { LoggerType } from '../../util'
import { handleMessage } from './message'

const connectedClients: Set<WebSocket> = new Set()

export function handleConnection(
	socket: WebSocket,
	request: IncomingMessage,
	log: LoggerType
) {
	log.info(`New Connection`)

	const [_path, params] = request?.url?.split('?')
	const connectionParams = queryString.parse(params)

	if (
		!connectionParams.auth ||
		connectionParams.auth != process.env.CONNECTION_STRING_KEY
	) {
		log.info(`Client sent no or an invalid Auth Param, Disconnecting`)
		return socket.close(1069)
	}
	log.info(`Client is Authorized`)
	connectedClients.add(socket)

	socket.on('ping', () => socket.pong())
	socket.on('pong', () => socket.ping())
	socket.on('message', (data) => handleMessage(socket, data, log))
	socket.on('close', (code) => {
		log.info(`Connection with a Client was closed with code ${code}`)
		return connectedClients.delete(socket)
	})

	return
}

export function sendPayloadToClients(data: any) {
	return connectedClients.forEach((socket) => {
		if (socket.readyState === WebSocket.OPEN)
			socket.send(JSON.stringify(data))
	})
}

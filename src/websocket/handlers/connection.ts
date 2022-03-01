import { Connection } from 'net-ipc'
import { LoggerType } from '../../util'
import { ConnectPayload, connectedClients, Payload } from '../server'

export function handleConnection(
	connection: Connection,
	payload: ConnectPayload,
	log: LoggerType
) {
	log.info(`New Connection`)

	if (!payload) return connection.close()
	else if (!payload.auth || payload.auth != process.env.PAYLOAD_AUTH_KEY)
		return connection.close('No or Invalid Auth')
	// HARD CODE CUZ LAZY
	else if (
		!payload.agent ||
		![
			'mrpoll',
			'mrpoll:beta',
			'eboat',
			'eboat:beta',
			'eboat:dev',
			'mrpoll:gateway',
			'mrpoll:beta:gateway',
			'api',
		].includes(payload.agent)
	)
		return connection.close('Invalid Agent')

	return connectedClients.set(payload.agent, { payload, connection })
}

export function sendPayloadToClients(data: SendPayload) {
	return connectedClients.forEach((socket) => {
		socket.connection.send(data)
	})
}

interface SendPayload {
	type: string
	data: any
}

import { logger } from '../util'
import { handleConnection } from './handlers/connection'
import { Server as IPCServer, Connection } from 'net-ipc'
import { handleMessage } from './handlers/message'
import { handleDisconnect } from './handlers/disconnect'

const log = logger({ name: 'WebSocket Manager' })
export const payloadQueue: Map<string, Payload> = new Map()
export const connectedClients: Map<
	String,
	{ connection: Connection; payload: ConnectPayload }
> = new Map()
export function createIPCServer() {
	const ipc = new IPCServer({
		port: 4204,
	})

	ipc.on('connect', (connection, payload) =>
		handleConnection(connection, payload, log)
	)
	ipc.on('message', (message, connection) =>
		handleMessage(message, connection, log, ipc)
	)
	ipc.on('disconnect', (connection, reason) =>
		handleDisconnect(connection, reason, log)
	)
	ipc.on('ready', (addr) => log.info(`Server is online on ${addr}`))
	return ipc.start()
}

export interface Payload {
	auth: string
	type: 'payload' | 'payload_resolved' | 'vote' | 'deploy'
	requestFor: 'mrpoll' | 'mrpoll:beta' | 'eboat'
	requestType: 'send' | 'request'
	id: string
	data: any
}

export interface ConnectPayload {
	auth: string
	agent: string
}

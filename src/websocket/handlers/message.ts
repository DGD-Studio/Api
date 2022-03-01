import { Connection, Server } from 'net-ipc'
import { LoggerType } from '../../util'
import { connectedClients, payloadQueue, Payload } from '../server'

export async function handleMessage(
	message: any | string,
	connection: Connection,
	log: LoggerType,
	server: Server
) {
	const payload: Payload =
		typeof message === 'string' ? JSON.parse(message) : message
	if (!payload.auth || payload.auth != process.env.PAYLOAD_AUTH_KEY)
		return connection.close()
	if (!payload.type) return
	console.log(payload)

	if (payload.requestFor === 'eboat') {
		log.info(`[Api] Handling a payload for eboat`)
		const client = connectedClients.get(payload.requestFor)
		if (!client) return payloadQueue.set(payload.id, payload)
		const data = await client.connection.request(payload)
		if (data.ok)
			return connection.send({ type: 'payload_resolved', id: payload.id })
		return
	}

	if (payload.type === 'payload') {
		log.info(`[Api] Handling a payload | ${payload.data.t}`)
		const client = connectedClients.get(payload.requestFor)
		if (!client) return payloadQueue.set(payload.id, payload)
		const data = await client.connection.request(payload)
		if (data.ok)
			return connection.send({ type: 'payload_resolved', id: payload.id })
		return
	}
	//lazy
	server.broadcast(payload)
}

setInterval(() => {
	if (!payloadQueue.size) return
	payloadQueue.forEach(async (payload) => {
		if (connectedClients.has(payload.requestFor)) {
			const client = connectedClients.get(payload.requestFor)
			if (payload.requestType === 'send') {
				payloadQueue.delete(payload.id)
				return client.connection.send(payload)
			} else {
				const data = await client.connection.request(payload)
				if (data.ok) return payloadQueue.delete(payload.id)
			}
		}
	})
})

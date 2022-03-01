import { existsSync, mkdirSync } from 'fs'
import express from 'express'
import routes from './routes'
import { logger } from '../util'
import { Client, ClientStatus } from 'net-ipc'
import { nanoid } from 'nanoid'
const log = logger({ name: 'Rest Api' })
const { PORT = '8080', CACHE_DIRECTORY = 'cache' } = process.env

if (!existsSync(`${process.cwd()}/${CACHE_DIRECTORY}`))
	mkdirSync(`${process.cwd()}/${CACHE_DIRECTORY}`)

const app = express()
	.use(express.json())
	.disable('x-powered-by')
	.use('/', routes)
const ipcClient = new Client({
	port: 4204,
	host: process.env.IPC_URL,
	reconnect: true,
})
const Queue = new Set()
export async function sendToIpc(payload: any) {
	if (ipcClient.status != 3)
		return Queue.has(payload)
			? Queue.add({
					...payload,
					auth: process.env.PAYLOAD_AUTH_KEY,
					id: nanoid(5),
			  })
			: null
	return ipcClient.send({
		...payload,
		auth: process.env.PAYLOAD_AUTH_KEY,
		id: nanoid(5),
	})
}

ipcClient.on('ready', (_data) => log.info(`Connected to Ipc`))
ipcClient.on('status', (status) => {
	if (status === 3 && Queue.size)
		Queue.forEach((payload) => sendToIpc(payload))
	else log.warn(`IPC status changed to: ${stattsts[status]}`)
})

export function startServer() {
	ipcClient.connect({ auth: process.env.PAYLOAD_AUTH_KEY, agent: 'api' })
	return app.listen(PORT, () => log.info(`Server is Live`))
}

const stattsts = {
	0: 'IDLE',
	1: 'CONNECTING',
	2: 'CONNECTED',
	3: 'READY',
	4: 'DISCONNECTED',
	5: 'RECONNECTING',
}

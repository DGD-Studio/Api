import { Util, logger } from './util'
import dotenv from 'dotenv'
import { startServer } from './server/server'
import { createWebsocketServer } from './websocket/server'
import { startBot } from './bot/bot'
import { connectDatabase } from './util/database'
dotenv.config()
const log = logger({ name: 'Main Process' })

log.info(`Checking .env`)
Util.checkEnv()

async function main() {
	log.info(`Starting WebServer`)
	const express = startServer()

	log.info(`Starting Websocket Server`)
	const wss = createWebsocketServer(express)

	log.info(`Starting DGD Manager`)
	const bot = startBot()

	return { express, wss, bot }
}

/*process.on('SIGINT', async () => {
	if (process.env.MODE === 'dev')
		_bot.guilds.cache.get('924030936851574805').commands.set([])
}) */
main()

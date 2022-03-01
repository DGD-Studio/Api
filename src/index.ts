import { Util, logger } from './util'
import dotenv from 'dotenv'
dotenv.config()
import { startServer } from './server/server'
import { startBot } from './bot/bot'
import { connectDatabase } from './util/database'
import { createIPCServer } from './websocket/server'

const log = logger({ name: 'Main Process' })

log.info(`Checking .env`)
Util.checkEnv()

function main() {
	log.info(`Starting WebServer`)
	const express = startServer()

	/*log.info(`Starting Ipc Server`)
	const ipc = createIPCServer()*/

	log.info(`Starting DGD Manager`)
	const bot = startBot()

	return { express, bot }
}

/*process.on('SIGINT', async () => {
	if (process.env.MODE === 'dev')
		_bot.guilds.cache.get('924030936851574805').commands.set([])
}) */
main()

import { Util, logger } from './util'
import dotenv from 'dotenv'
import { startServer } from './server/server'
import { createWebsocketServer } from './websocket/server'
import { startBot } from './bot/bot'
dotenv.config()
const log = logger({ name: 'Main Process' })

log.info(`Checking .env`)
Util.checkEnv()

log.info(`Starting WebServer`)
const express = startServer()

log.info(`Starting Websocket Server`)
const _wss = createWebsocketServer(express)

log.info(`Starting DGD Manager`)
const _bot = startBot()

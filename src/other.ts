import dotenv from 'dotenv'
dotenv.config()
import { createIPCServer } from './websocket/server'

createIPCServer()

import { existsSync, mkdirSync } from 'fs'
import express from 'express'
import routes from './routes'
import { logger } from '../util'
const log = logger({ name: 'Rest Api' })
const { PORT = '8080', CACHE_DIRECTORY = 'cache' } = process.env

if (!existsSync(`${process.cwd()}/${CACHE_DIRECTORY}`))
	mkdirSync(`${process.cwd()}/${CACHE_DIRECTORY}`)

const app = express()
	.use(express.json())
	.disable('x-powered-by')
	.use('/', routes)

export function startServer() {
	return app.listen(PORT, () => log.info(`Server is Live`))
}

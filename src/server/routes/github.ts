import { execSync } from 'child_process'
import { Response, Router, Request } from 'express'
import { sendPayloadToClients } from '../../websocket/handlers/connection'

const githubRouter = Router()

githubRouter.post('/hook', (req: Request, res: Response) => {
	const data = req.body
	// we dont care
	if (data.repository.name != 'Easter-Boat')
		return res.status(200).send({ status: 200 })
	const branch = (data.refs as string).split('/')[2]
	if (!branch || ['main', 'dev', 'semi-rewrite'].includes(branch)) {
		// we dont care
		return res.status(200).send({ status: 200 })
	}

	sendPayloadToClients({ event: 'DEPLOY', bot: branch })

	return res.status(200).send({ status: 200 })
})

export default githubRouter

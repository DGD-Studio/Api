import { Response, Router, Request } from 'express'
import { redis } from '../../util/redis'
import { sendToIpc } from '../server'

const botlistsRouter = Router()

botlistsRouter.post('/ibl', (req: Request, res: Response) => {
	if (req.headers.authorization != process.env.IBL_AUTH) {
		return res.status(401).json({ message: 'Not Authorized', status: 401 })
	}

	sendToIpc({
		type: 'VOTE',
		data: { type: 'IBL', ...req.body },
		requestFor: 'all',
	})
	redis.publish(
		'Boat',
		JSON.stringify({ event: 'NEW_VOTE', type: 'IBL', data: req.body })
	)

	return res.status(200).send({ message: 'Success', status: 200 })
})

export default botlistsRouter

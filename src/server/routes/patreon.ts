import { Response, Router, Request } from 'express'

const patreonRouter = Router()

patreonRouter.post('/data', (req: Request, res: Response) => {
	switch (req.headers['x-patreon-event']) {
		case 'members:create':
			console.log(`New Member`)
			break
	}

	return res.status(200).send({ status: 200 })
})

export default patreonRouter

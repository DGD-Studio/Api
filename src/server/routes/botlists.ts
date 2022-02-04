import { Response, Router, Request } from 'express'
import { sendPayloadToClients } from '../../websocket/handlers/connection'

const botlistsRouter = Router()

botlistsRouter.post("/ibl", (req: Request, res: Response) => {
    if(req.headers.authorization != process.env.IBL_AUTH) {
        return res.status(401).json({ message: "Not Authorized", status: 401 })
    }

    sendPayloadToClients({ event: "NEW_VOTE", type: "IBL", data: req.body })

    return res.status(200).send({ message: "Success", status: 200 })
})

export default botlistsRouter
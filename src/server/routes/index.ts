import { Router } from 'express'
import CDNRouter from './cdn'
import patreonRouter from './patreon'
import botlistsRouter from './botlists'

const router = Router()

router.use('/cdn', CDNRouter)
router.use('/patreon', patreonRouter)
router.use("/botlists", botlistsRouter)

export default router

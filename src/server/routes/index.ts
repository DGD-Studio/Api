import { Router } from 'express'
import CDNRouter from './cdn'
import patreonRouter from './patreon'
import botlistsRouter from './botlists'
import githubRouter from './github'

const router = Router()

router.use('/cdn', CDNRouter)
router.use('/patreon', patreonRouter)
router.use('/botlists', botlistsRouter)
router.use('/github', githubRouter)

export default router

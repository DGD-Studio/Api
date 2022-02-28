import { Router } from 'express'
import CDNRouter from './cdn'
import patreonRouter from './patreon'
import botlistsRouter from './botlists'
import githubRouter from './github'
import sentryRouter from './sentry'

const router = Router()

router.use('/cdn', CDNRouter)
router.use('/patreon', patreonRouter)
router.use('/botlists', botlistsRouter)
router.use('/github', githubRouter)
router.use('/sentry', sentryRouter)

export default router

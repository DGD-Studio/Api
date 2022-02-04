import { Router } from 'express'
import CDNRouter from './cdn'
import patreonRouter from './patreon'

const router = Router()

router.use('/cdn', CDNRouter)
router.use('/patreon', patreonRouter)

export default router

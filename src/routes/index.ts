import { Router } from "express"
import CDNRouter from "./cdn"

const router = Router()

router.use("/cdn", CDNRouter)

export default router
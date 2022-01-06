import { Response, Router, Request } from "express"
import { Util, cache } from "../util"
import { readFileSync, readdirSync } from "fs"

const CDNRouter = Router()

CDNRouter.get('/:id', (req: Request, res: Response) => {
    if (!Util.isAuthorized(req)) return res.status(401).json({
        msg: "DGD Radio says your UnAuthorized"
    })

    const fileId = req.params.id
    const cachedData: any = cache.get(fileId)

    if (cachedData) {
        console.info(`Request for image: ${cachedData.fileName} [IN CACHE]`)
        res.contentType(cachedData.fileFomat)
        return res.status(200).send(Buffer.from(cachedData.fileData, 'binary'))
    } else {
        const allFiles = readdirSync(`${process.cwd()}/${process.env.CACHE_DIRECTORY}`)
        if (!allFiles.some((fileName) => fileName.includes(fileId))) return res.status(404).json({
            msg: `File with the name: ${fileId} Not Found.`
        })
        const fileName = allFiles.find((v) => v.includes(fileId))
        const fileData = readFileSync(`${process.cwd()}/${process.env.CACHE_DIRECTORY}/${fileName}`)
        const fileFomat = fileName.replace(fileId, '')
        console.info(`Request for image: ${fileName} [NOT IN CACHE]`)
        cache.set(fileId, { fileData, fileFomat, fileName })
        res.contentType(fileFomat)
        //@ts-ignore
        return res.status(200).send(Buffer.from(fileData, 'binary'))
    }
})

export default CDNRouter
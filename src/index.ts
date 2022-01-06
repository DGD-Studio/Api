import express from "express"
import { Util } from "./util"
import { existsSync, mkdirSync } from "fs"
import routes from "./routes"
import dotenv from "dotenv"
dotenv.config()

Util.objectContainsAll(
    process.env,
    [
        'MODE',
        'PORT',
        'CACHE_EXPIRY_TIMEOUT_SECONDS',
        'CACHE_DIRECTORY',
        'AUTH',
        'FILES_DIRECTORY'
    ],
    'Does not exists on process.env',
);

const {
    PORT = '8080',
    CACHE_DIRECTORY = 'cache',
    FILES_DIRECTORY = 'files',
} = process.env;

if (!existsSync(`${process.cwd()}/${CACHE_DIRECTORY}`))
    mkdirSync(`${process.cwd()}/${CACHE_DIRECTORY}`);
if (!existsSync(`${process.cwd()}/${FILES_DIRECTORY}`))
    mkdirSync(`${process.cwd()}/${FILES_DIRECTORY}`)

const app = express()
    .disable('x-powered-by')
    .use("/", routes)


app.listen(PORT, () => console.info(`Server is Live`))
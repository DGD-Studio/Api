import { Request } from 'express'

export class Util {
	constructor() {}

	static objectContainsAll(
		target: Record<string, any>,
		items: string[],
		message = 'Does not exists'
	): void {
		const result: string[] = []
		items.forEach((env) => {
			target[env] ?? result.push(env)
		})
		if (result.length) throw new Error(`${result.join(', ')} ${message}`)
	}

	static isAuthorized(request: Request): boolean {
		if (!request.headers.authorization) return false
		else if (request.headers.authorization != process.env.AUTH) return false
		return true
	}

	static checkEnv() {
		return Util.objectContainsAll(
			process.env,
			[
				'MODE',
				'PORT',
				'CACHE_EXPIRY_TIMEOUT_SECONDS',
				'CACHE_DIRECTORY',
				'AUTH',
				'BOT_TOKEN',
				'REDIS_URL',
			],
			'Does not exists on process.env'
		)
	}
}

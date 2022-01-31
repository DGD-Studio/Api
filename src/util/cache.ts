import NodeCache from 'node-cache'

const { CACHE_EXPIRY_TIMEOUT_SECONDS = '120' } = process.env

export const cache = new NodeCache({
	stdTTL: +CACHE_EXPIRY_TIMEOUT_SECONDS,
})

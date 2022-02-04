import { ManagerClient } from '../lib/ManagerClient'

export default function (client: ManagerClient) {
	return client.on('debug', (str) => client.log.debug(str))
}

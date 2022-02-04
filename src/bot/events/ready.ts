import { ManagerClient } from '../lib/ManagerClient'

export default function (client: ManagerClient) {
	return client.on('ready', () => {
		client.log.info('Online')
	})
}

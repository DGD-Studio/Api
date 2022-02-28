import { Connection } from 'net-ipc'
import { LoggerType } from '../../util'
import { connectedClients } from '../server'

export function handleDisconnect(
	connection: Connection,
	reason: string,
	log: LoggerType
) {
	const v = [...connectedClients.values()].find(
		(d) => d.connection.id === connection.id
	)
	if (!v)
		return log.info(
			`Connection with the Id [${connection.id}] has disconnected.`
		)
	connectedClients.delete(v.payload.agent)
	return log.info(
		`Connection with the Agent [${v.payload.agent}] has disconnected`
	)
}

import { ManagerClient } from '../lib/ManagerClient'

export default function (client: ManagerClient) {
	return client.on('interactionCreate', async (int) => {
		if (int.isCommand()) {
			await int.deferReply()
			const cmd = client.scommands.get(int.commandName)
			return cmd.execute(int)
		} else return
	})
}

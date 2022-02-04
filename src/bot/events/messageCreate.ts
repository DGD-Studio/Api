import { ManagerClient } from '../lib/ManagerClient'

export default function (client: ManagerClient) {
	const prefix = process.env.MODE === 'dev' ? 'dev' : '!'
	return client.on('messageCreate', async (message) => {
		if (!message.guildId) return
		if (message.webhookId) return
		if (message.author.bot) return
		const lowerContent = message.content.toLowerCase()

		if (!message.content.startsWith(prefix)) return

		const args = lowerContent.startsWith(prefix + ' ')
			? message.content.slice(prefix.length + 1).split(' ')
			: message.content.slice(prefix.length).split(' ')

		if (!args) return

		const command = args.shift().toLowerCase()
		const cmd = client.commands.get(command)
		if (!cmd) return

		return cmd.execute(message, args)
	})
}

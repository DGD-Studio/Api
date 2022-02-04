import { Message } from 'discord.js'
import { BBAASSEECCOOMMAANNDD } from '../lib/BaseCommand'

export default class extends BBAASSEECCOOMMAANNDD {
	constructor(client) {
		super('deploy', client)
	}
	async execute(message: Message<boolean>): Promise<any> {
		if (
			!['579466943170609153', '640740355905552406'].includes(
				message.author.id
			)
		)
			return
		const dgd = this.client.guilds.cache.get('924030936851574805')
		await dgd.commands.fetch()
		const ee = this.client.scommands.map((cmd) => cmd.data)
		const data = await dgd.commands.set(ee)
		data.forEach(async (cmd) => {
			const c = this.client.scommands.get(cmd.name)
			if (c.perms)
				await dgd.commands.permissions.set({
					command: cmd,
					permissions: c.perms,
				})
		})
		return message.reply('Done')
	}
}

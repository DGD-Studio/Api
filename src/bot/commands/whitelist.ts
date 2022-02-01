import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction, CacheType } from 'discord.js'
import { sendPayloadToClients } from '../../websocket/handlers/connection'
import { BaseCommand } from '../lib/BaseCommand'

export default class extends BaseCommand {
	constructor(client) {
		super(data, client)
	}
	async execute(command: CommandInteraction<CacheType>): Promise<any> {
		const user = command.options.getUser('user')
		if (user.bot) return command.followUp(`-_-`)
		sendPayloadToClients({
			event: 'WHITELIST_USER',
			id: user.id,
			staff: command.user.id,
		})
		return command.followUp(`Done, wait for confirmation from Easter Boat`)
	}
}

const data = new SlashCommandBuilder()
	.setName('whitelists')
	.setDescription('Whitlists a user')
	.addUserOption((u) =>
		u
			.setName('user')
			.setDescription('You have common sense right')
			.setRequired(true)
	)
	.toJSON()

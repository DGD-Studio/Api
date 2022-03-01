import { SlashCommandBuilder } from '@discordjs/builders'
import {
	CommandInteraction,
	CacheType,
	ApplicationCommandPermissionType,
} from 'discord.js'
import { sendToIpc } from '../../server/server'
import { sendPayloadToClients } from '../../websocket/handlers/connection'
import { BaseCommand } from '../lib/BaseCommand'

export default class extends BaseCommand {
	constructor(client) {
		super(data, client, [
			{
				id: '938408515750473779',
				// @ts-ignore
				type: ApplicationCommandPermissionType.Role,
				permission: true,
			},
			{
				// @ts-ignore
				id: '927630083835986001',
				// @ts-ignore
				type: ApplicationCommandPermissionType.Role,
				permission: true,
			},
		])
	}
	async execute(command: CommandInteraction<CacheType>): Promise<any> {
		const user = command.options.getUser('user')
		if (user.bot) return command.followUp(`-_-`)
		sendToIpc({
			type: 'BLACKLIST_USER',
			data: {
				id: user.id,
				staff: command.user.id,
			},
			requestFor: 'eboat',
		})
		return command.followUp(`Done, wait for confirmation from Easter Boat`)
	}
}

const data = new SlashCommandBuilder()
	.setName('blacklists')
	.setDescription('Blacklists a user')
	.addUserOption((u) =>
		u
			.setName('user')
			.setDescription('You have common sense right')
			.setRequired(true)
	)
	.setDefaultPermission(false)
	.toJSON()

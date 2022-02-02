import { SlashCommandBuilder } from '@discordjs/builders'
import {
	CommandInteraction,
	CacheType,
	ApplicationCommandPermissionType,
} from 'discord.js'
import { sendPayloadToClients } from '../../websocket/handlers/connection'
import { BaseCommand } from '../lib/BaseCommand'

export default class extends BaseCommand {
	constructor(client) {
		super(data, client, [
			{
				id: '927630083835986001',
				type: ApplicationCommandPermissionType.Role,
				permission: true,
			},
			{
				id: '938408515750473779',
				type: ApplicationCommandPermissionType.Role,
				permission: true,
			},
		])
	}
	async execute(command: CommandInteraction<CacheType>): Promise<any> {
		const user = command.options.getUser('user')
		if (user.bot) return command.followUp(`-_-`)
		const badge = command.options.get('badge').value as string
		sendPayloadToClients({
			event: 'BADGE_UPDATE',
			id: user.id,
			staff: command.user.id,
			badge,
		})
		return command.followUp(`Done, wait for confirmation from Easter Boat`)
	}
}

const data = new SlashCommandBuilder()
	.setName('badge')
	.setDescription('Add or remove a badge from a user')
	.addUserOption((u) =>
		u
			.setName('user')
			.setDescription('You have common sense right')
			.setRequired(true)
	)
	.addStringOption((str) =>
		str
			.setName('badge')
			.setDescription('You have common sense right')
			.addChoices([
				['Beta Tester', 'BETA_TESTER'],
				['Bug Hunter', 'BUG_HUNTER'],
				['Developer', 'DEVELOPER'],
				['Before 100', 'BEFORE_100_SQUAD'],
			])
	)
	.setDefaultPermission(false)
	.toJSON()

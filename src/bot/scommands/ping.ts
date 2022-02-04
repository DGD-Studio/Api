import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction, CacheType } from 'discord.js'
import { BaseCommand } from '../lib/BaseCommand'

export default class extends BaseCommand {
	constructor(client) {
		super(data, client)
	}
	async execute(command: CommandInteraction<CacheType>): Promise<any> {
		return command.followUp(this.client.ws.ping.toString())
	}
}

const data = new SlashCommandBuilder()
	.setName('ping')
	.setDescription('PIng the bot!')

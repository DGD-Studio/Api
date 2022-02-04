import { ActivityType, Client, Collection, GatewayIntentBits } from 'discord.js'
import { LoggerType, logger } from '../../util'
import { readdirSync } from 'fs'
import { BaseCommand, BBAASSEECCOOMMAANNDD } from './BaseCommand'

export class ManagerClient extends Client {
	scommands: Collection<string, BaseCommand>
	log: LoggerType
	commands: Collection<string, BBAASSEECCOOMMAANNDD>
	constructor() {
		super({
			intents: [
				GatewayIntentBits.GuildMembers,
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMessages,
			],
			presence: {
				status: 'dnd',
				activities: [
					{
						name: 'over DGD Studio',
						type: ActivityType.Watching,
					},
				],
			},
		})

		this.commands = new Collection()
		this.scommands = new Collection()
		this.log = logger({ name: 'DGD Manager' })
	}
	start() {
		this.init()
		super.login(
			process.env.MODE === 'dev'
				? process.env.DEV_BOT_TOKEN
				: process.env.BOT_TOKEN
		)
		return this
	}
	init() {
		readdirSync(`./build/bot/scommands/`).forEach(async (file) => {
			delete require.cache[require.resolve(`../scommands/${file}`)]
			const { default: pull } = await import(`../scommands/${file}`)

			const cmd: BaseCommand = new pull(this)
			this.scommands.set(cmd.data.name, cmd)
		})
		readdirSync(`./build/bot/commands/`).forEach(async (file) => {
			delete require.cache[require.resolve(`../commands/${file}`)]
			const { default: pull } = await import(`../commands/${file}`)

			const cmd: BBAASSEECCOOMMAANNDD = new pull(this)
			this.commands.set(cmd.name, cmd)
		})
		readdirSync(`./build/bot/events/`).forEach(async (file) => {
			delete require.cache[require.resolve(`../events/${file}`)]
			const { default: pull } = await import(`../events/${file}`)

			new pull(this)
		})
	}
}

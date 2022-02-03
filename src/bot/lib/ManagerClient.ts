import { ActivityType, Client, Collection, GatewayIntentBits } from 'discord.js'
import { LoggerType, logger } from '../../util'
import { readdirSync } from 'fs'
import { BaseCommand } from './BaseCommand'

export class ManagerClient extends Client {
	commands: Collection<string, BaseCommand>
	log: LoggerType
	constructor() {
		super({
			intents: [GatewayIntentBits.GuildMembers, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
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
		this.log = logger({ name: 'DGD Manager' })
		this.on('debug', (str) => this.log.debug(str))
		this.on('ready', () => this.ready())
		this.on('interactionCreate', async (int) => {
			if (int.isCommand()) {
				await int.deferReply()
				const cmd = this.commands.get(int.commandName)
				return cmd.execute(int)
			} else return
		})
		this.on('messageCreate', async (message) => {
			if (!message.guildId) return
			if (message.webhookId) return
			if (message.author.bot) return

			if (!message.content.startsWith('=')) return
			if (message.content === '=deploy' && ["579466943170609153", "640740355905552406"].includes(message.author.id)) {
				const dgd = this.guilds.cache.get('924030936851574805')
				await dgd.commands.fetch()
				const ee = this.commands.map((cmd) => cmd.data)
				const data = await dgd.commands.set(ee)
				data.forEach(async (cmd) => {
					const c = this.commands.get(cmd.name)
					if (c.perms)
						await dgd.commands.permissions.set({
							command: cmd,
							permissions: c.perms,
						})
				})
				message.reply("Done")
				return
			} else if(message.content === "=ping") {
				message.reply(this.ws.ping.toString())
				return 
			}

		})
	}
	start() {
		this.init()
		super.login(process.env.BOT_TOKEN)
		return this
	}
	init() {
		readdirSync(`./build/bot/commands/`).forEach(async (file) => {
			delete require.cache[require.resolve(`../commands/${file}`)]
			const { default: pull } = await import(`../commands/${file}`)

			const cmd: BaseCommand = new pull(this)
			this.commands.set(cmd.data.name, cmd)
		})
	}
	async ready() {
		this.log.info('Online')
	}
}

import { APIApplicationCommandPermission } from 'discord-api-types'
import { CommandInteraction } from 'discord.js'
import { ManagerClient } from './ManagerClient'

export class BaseCommand {
	data: any
	client: ManagerClient
	perms?: Perm
	constructor(data: any, client: ManagerClient, perms?: Perm) {
		this.data = data
		this.client = client
		this.perms = perms || null
	}
	async execute(command: CommandInteraction): Promise<any | void> {
		throw new Error('Command does not have its own execute function')
	}
}

type Perm = APIApplicationCommandPermission[]

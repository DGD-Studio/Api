import { ActivityType, Client, GatewayIntentBits } from "discord.js"

export class ManagerClient extends Client {
    constructor(){
        super({
            intents: [GatewayIntentBits.GuildMembers, GatewayIntentBits.Guilds],
            presence: {
                status: "dnd",
                activities: [
                    {
                        name: "over DGD Studio",
                        type: ActivityType.Watching
                    }
                ]
            }
        })
    }
    start(){
        super.login(process.env.BOT_TOKEN)
        return this 
    }
}
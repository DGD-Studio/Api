import { Response, Router, Request } from 'express'
import { Embed, WebhookClient } from 'discord.js'
import * as parser from '../../util/sentryFunctions'

const sentry = new WebhookClient({
	url: process.env.BOT_LOG_WEBHOOK,
})

const sentryRouter = Router()

sentryRouter.post('/', (req: Request, res: Response) => {
	const sentryStuff = createMessage(req.body)
	sentry.send({
		embeds: [sentryStuff.embeds[0]],
		avatarURL: 'https://sentrydiscord.dev/icons/sentry.png',
		username: 'Sentry',
	})

	return res.status(200).send({ status: 200 })
})

function cap(str, length) {
	if (str == null || str?.length <= length) {
		return str
	}

	return str.substr(0, length - 1) + '\u2026'
}
function createMessage(event) {
	const embed = new Embed().setColor(15158332)
	const projectName = parser.getProject(event)
	const eventTitle = parser.getTitle(event)

	if (projectName) {
		const embedTitle = `[${projectName}] ${eventTitle}`
		embed.setTitle(cap(embedTitle, 250))
	} else {
		embed.setTitle(cap(eventTitle, 250))
	}

	embed.setURL(parser.getLink(event))
	embed.setTimestamp(parser.getTime(event))

	const fileLocation = parser.getFileLocation(event)

	const snippet = cap(parser.getErrorCodeSnippet(event), 3900)

	if (snippet) {
		embed.setDescription(
			`${fileLocation ? `\`📄 ${fileLocation}\`\n` : ''}\`\`\`${
				parser.getLanguage(event) ?? parser.getPlatform(event)
			}\n${snippet}
		\`\`\``
		)
	} else {
		embed.setDescription('Unable to generate code snippet.')
	}

	const location = parser.getErrorLocation(event, 7)
	if (location?.length > 0) {
		embed.addField({
			name: 'Stack',
			value: `\`\`\`${cap(location.join('\n'), 1000)}\n\`\`\``,
		})
	}

	const user = parser.getUser(event)
	if (user?.username) {
		embed.addField({
			name: 'User',
			value: cap(
				`${user.username} ${user.id ? `(${user.id})` : ''}`,
				1024
			),
			inline: true,
		})
	}

	const tags = parser.getTags(event)
	if (Object.keys(tags).length > 0) {
		embed.addField({
			name: 'Tags',
			value: cap(
				tags.map(([key, value]) => `${key}: ${value}`).join('\n'),
				1024
			),
			inline: true,
		})
	}

	const extras = parser.getExtras(event)
	if (extras.length > 0) {
		embed.addField({
			name: 'Extras',
			value: cap(extras.join('\n'), 1024),
			inline: true,
		})
	}

	const contexts = parser.getContexts(event)
	if (contexts.length > 0) {
		embed.addField({
			name: 'Contexts',
			value: cap(contexts.join('\n'), 1024),
			inline: true,
		})
	}

	const release = parser.getRelease(event)
	if (release) {
		embed.addField({
			name: 'Release',
			value: cap(release, 1024),
			inline: true,
		})
	}

	return {
		username: 'Sentry',
		avatar_url: `https://sentrydiscord.dev/icons/sentry.png`,
		embeds: [embed.toJSON()],
	}
}

export default sentryRouter

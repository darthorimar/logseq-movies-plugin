import '@logseq/libs'
import {ItemChooser} from './ItemChooser'
import {itemsApiRequest} from './ItemsApi'
import {insertItemAtCursor, parseMyAnimeListYear, tokenize} from './utils'
import {RateLimiter} from './RateLimiter'
import {Item} from './Item'


async function main() {
    await ItemChooser.instance.init()

    registerMovieCommand()
    registerAnimeCommand()
}

function registerMovieCommand() {
    const icon = '🎬'
    logseq.Editor.registerSlashCommand(
        'Movie (IMDB)', async () => {
            const block = await logseq.Editor.getCurrentBlock()
            if (!block) return
            await itemsApiRequest(
                'Movie Title', icon,
                (text: string) => {
                    const query = tokenize(text)
                    return new URL(`https://v2.sg.media-imdb.com/suggestion/${encodeURIComponent(query[0].toLowerCase())}/${encodeURIComponent(query)}.json`)
                },
                (json) => {
                    return json['d'].map((d: any) => {
                        if (!d.id) return null
                        return {
                            title: d.l,
                            year: d.y,
                            link: `https://www.imdb.com/title/${d.id}`
                        }
                    }).filterOutNullable()
                },
                (item: Item) => {
                    insertItemAtCursor(item, icon, block.format)
                }
            )
        },
    )
}

function registerAnimeCommand() {
    const rateLimiter = new RateLimiter(1)
    const icon = '🎬'
    logseq.Editor.registerSlashCommand(
        'Anime (MyAnimeList)', async () => {
            const block = await logseq.Editor.getCurrentBlock()
            if (!block) return

            await itemsApiRequest(
                'Anime Title', icon,
                (text: string) => {
                    const query = encodeURIComponent(tokenize(text))
                    return new URL(`https://api.jikan.moe/v4/anime?q=${query}&order_by=score&sort=desc`)
                },
                (json) => {
                    return json['data'].map((d: any) => ({title: d.title, link: d.url, year: parseMyAnimeListYear(d)}))
                },
                (item: Item) => {
                    insertItemAtCursor(item, icon, block.format)
                },
                rateLimiter,
            )
        },
    )
}


logseq.ready(main).catch(console.error)

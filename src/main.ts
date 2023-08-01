import '@logseq/libs'
import {ItemChooser} from './ItemChooser'
import {itemsApiRequest} from './ItemsApi'
import {insertItemAtCursor} from './utils'
import {Item} from './Item'
import {myAnimeListParserDefinition, imdbParserDefinition} from './ResourceParserDefinition'


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
                imdbParserDefinition,
                (item: Item) => {
                    insertItemAtCursor(item, icon, block.format)
                }
            )
        },
    )
}

function registerAnimeCommand() {
    const icon = '🎬'
    logseq.Editor.registerSlashCommand(
        'Anime (MyAnimeList)', async () => {
            const block = await logseq.Editor.getCurrentBlock()
            if (!block) return

            await itemsApiRequest(
                'Anime Title', icon,
                myAnimeListParserDefinition,
                (item: Item) => {
                    insertItemAtCursor(item, icon, block.format)
                },
            )
        },
    )
}


logseq.ready(main).catch(console.error)

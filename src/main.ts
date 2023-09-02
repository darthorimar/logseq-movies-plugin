import '@logseq/libs'
import {ItemChooser} from './ItemChooser'
import {itemsApiRequest} from './ItemsApi'
import {insertItemAtCursor} from './utils'
import {Item} from './Item'
import {imdbParserDefinition, myAnimeListParserDefinition} from './ResourceParserDefinition'
import {settingSchema} from './settings'


async function main() {
    await ItemChooser.instance.init()
    logseq.useSettingsSchema(settingSchema)

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
                    insertItemAtCursor(item, 'movie', block.format)
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
                    insertItemAtCursor(item, 'anime', block.format)
                },
            )
        },
    )
}


logseq.ready(main).catch(console.error)

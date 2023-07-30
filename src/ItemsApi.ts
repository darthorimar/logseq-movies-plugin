import {Item} from './Item'
import {ItemChooser} from './ItemChooser'
import {ResourceParserDefinition} from './ResourceParserDefinition'
import {ResourceParser} from './ResourceParser'

/**
 * Show `ItemChooser` and populate with results provided by some API
 *
 * @param title title for thing user is searching for, will be shown as input placeholder
 * @param icon input field icon
 * @param parserDefinition describes the way to parse 3rd party API
 * @param onSelected will be called when user selects some item
 */
export async function itemsApiRequest(
    title: string,
    icon: string,
    parserDefinition: ResourceParserDefinition,
    onSelected: (item: Item) => void,
) {
    const parser = new ResourceParser(parserDefinition)
    await ItemChooser.instance.show(
        title,
        icon,
        async (text: string) => {
            if (!text) return null
            return parser.parse(text)
        },
        onSelected,
        () => parser.discard(),
    )
}
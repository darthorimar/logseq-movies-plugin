import {Item} from './Item'
import {ItemChooser} from './ItemChooser'
import {RateLimiter} from './RateLimiter'

/**
 * Show `ItemChooser` and populate with results provided by some API
 *
 * @param title title for thing user is searching for, will be shown as input placeholder
 * @param icon input field icon
 * @param buildUrl build 3rd party API URL to search user query, retrieved URL should specify JSON as expected format
 * @param getCompletionItems handler to transform JSON API response to the list of items which will be shown in the completion box for the user
 * @param onSelected will be called when user selects some item
 * @param rateLimiter `RateLimiter` instance to use for the queries, if `null` no rate limiting will be used and query will be performed one very user type
 */
export async function itemsApiRequest(
    title: string,
    icon: string,
    buildUrl: (text: string) => URL,
    getCompletionItems: (json: any) => Item[] | null,
    onSelected: (item: Item) => void,
    rateLimiter: RateLimiter | null = null,
) {
    await ItemChooser.instance.show(
        title,
        icon,
        async (text: string) => {
            if (!text) return null
            const url = buildUrl(text)
            const response: Response | null = rateLimiter == null
                ? await fetch(url)
                : await rateLimiter.runWithRateLimiting(() => fetch(url))
            if (!response) return null
            return response.json().then(getCompletionItems)
        },
        onSelected,
        rateLimiter == null
            ? (() => {})
            : (() => rateLimiter.discard())
    )
}
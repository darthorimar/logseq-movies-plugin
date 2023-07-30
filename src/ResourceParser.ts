import {ResourceParserDefinition} from './ResourceParserDefinition'
import {RateLimiter} from './RateLimiter'
import {Item} from './Item'

/**
 * Responsible for parsing a resource a 3rd party resource defined by `definition`
 */
export class ResourceParser {
    private readonly rateLimiter: RateLimiter | null


    constructor(private readonly definition: ResourceParserDefinition) {
        this.rateLimiter = definition.createRateLimiter?.() ?? null
    }

    /**
     * Parses the given query by fetching data from a 3rd party API and
     * transforming it into completion items using the provided `definition`.
     *
     * @param query - The query string to parse.
     * @return A promise that resolves to an array of completion item. If the response is null or if an error occurs, the promise resolves to null.
     */
    public async parse(query: string): Promise<Item[] | null> {
        const url = this.definition.buildUrl(query)
        const response: Response | null = this.rateLimiter == null
            ? await fetch(url)
            : await this.rateLimiter.runWithRateLimiting(() => fetch(url))
        if (!response) return null
        return response.json().then(json => this.definition.parse(json))
    }

    /**
     * Discards the ResourceParser, should be called when instance is not needed anymore
     *
     * Invalidates the RateLimiter internally
     */
    public discard(): void {
        this.rateLimiter && this.rateLimiter.discard()
    }
}
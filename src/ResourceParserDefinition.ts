import {Item} from './Item'
import {parseMyAnimeListYear, tokenize} from './utils'
import {RateLimiter} from './RateLimiter'

/**
 * Represents the description of a resource parser used for retrieving and processing anime and movies from a 3rd party API.
 */
export interface ResourceParserDefinition {
    /**
     * Build 3rd party API URL to search user query, retrieved URL should specify JSON as expected format
     */
    buildUrl: (text: string) => URL

    /**
     * Parses result to the array of Item or `null` if any error occurred during parsing
     */
    parse: (json: any) => Item[] | null

    /**
     * Creates `RateLimiter` instance to use for the queries, if `null` no rate limiting will be used and query will be performed one very user type
     */
    createRateLimiter: (() => RateLimiter) | null,
}

/**
 * Definition of a parser for anime from IMDB
 */
export const imdbParserDefinition: ResourceParserDefinition = {
    buildUrl: (text) => {
        const query = tokenize(text)
        return new URL(`https://v2.sg.media-imdb.com/suggestion/${encodeURIComponent(query[0].toLowerCase())}/${encodeURIComponent(query)}.json`)
    },
    parse: (json) => {
        return json['d'].map((d: any) => {
            if (!d.id) return null
            if (!['movie', 'tvSeries', 'tvMiniSeries'].includes(d.qid)) return null
            return {
                title: d.l,
                year: d.y,
                link: `https://www.imdb.com/title/${d.id}`
            }
        }).filterOutNullable()
    },
    createRateLimiter: null,
}

/**
 * Definition of a parser for anime from MyAnimeList
 *
 * Uses api.jikan.moe under as an API
 */
export const myAnimeListParserDefinition: ResourceParserDefinition = {
    buildUrl: (text) => {
        const query = encodeURIComponent(tokenize(text))
        return new URL(`https://api.jikan.moe/v4/anime?q=${query}&order_by=score&sort=desc`)
    },
    parse: (json) => {
        return json['data'].map((d: any) => ({title: d.title, link: d.url, year: parseMyAnimeListYear(d.aired)}))
    },
    createRateLimiter: () => new RateLimiter(/*queries per sec*/1),
}
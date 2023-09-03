import assert from 'assert'
import {
    resetLogseqPluginSettings,
    setLogseqPluginSettingsAnimeTemplate,
    setLogseqPluginSettingsMovieTemplate
} from './logseqTestUtils'
import {createLinkByItem} from '../src/links'
import {anime, movies, templates} from './testData'

describe('createLinkByItem test', () => {
    afterEach(() => resetLogseqPluginSettings())

    // movies
    it('Should create a link for a movie with a custom template', () => {
        setLogseqPluginSettingsMovieTemplate(templates.titleYear)

        const actualMd = createLinkByItem(movies.pulpFiction, 'movie', 'markdown')
        assert.equal(actualMd, '[Pulp Fiction (1994)](https://www.imdb.com/title/tt0110912/)')

        const actualOrg = createLinkByItem(movies.pulpFiction, 'movie', 'org')
        assert.equal(actualOrg, '[[https://www.imdb.com/title/tt0110912/][Pulp Fiction (1994)]]')
    })

    it('Should create a link for a movie with defaultTemplate', () => {
        setLogseqPluginSettingsMovieTemplate(undefined)

        const actualMd = createLinkByItem(movies.pulpFiction, 'movie', 'markdown')
        assert.equal(actualMd, '[🎬 Pulp Fiction](https://www.imdb.com/title/tt0110912/)')

        const actualOrg = createLinkByItem(movies.pulpFiction, 'movie', 'org')
        assert.equal(actualOrg, '[[https://www.imdb.com/title/tt0110912/][🎬 Pulp Fiction]]')
    })

    // anime

    it('Should create a link for an anime with a custom template', () => {
        setLogseqPluginSettingsAnimeTemplate(templates.titleYear)

        const actualMd = createLinkByItem(anime.cowboyBebop, 'anime', 'markdown')
        assert.equal(actualMd, '[Cowboy Bebop (1998 - 1999)](https://myanimelist.net/anime/1/Cowboy_Bebop)')

        const actualOrg = createLinkByItem(anime.cowboyBebop, 'anime', 'org')
        assert.equal(actualOrg, '[[https://myanimelist.net/anime/1/Cowboy_Bebop][Cowboy Bebop (1998 - 1999)]]')
    })

    it('Should create a link for an anime with default template', () => {
        setLogseqPluginSettingsAnimeTemplate(undefined)

        const actualMd = createLinkByItem(anime.cowboyBebop, 'anime', 'markdown')
        assert.equal(actualMd, '[🎬 Cowboy Bebop](https://myanimelist.net/anime/1/Cowboy_Bebop)')

        const actualOrg = createLinkByItem(anime.cowboyBebop, 'anime', 'org')
        assert.equal(actualOrg, '[[https://myanimelist.net/anime/1/Cowboy_Bebop][🎬 Cowboy Bebop]]')
    })
})
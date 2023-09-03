import assert from 'assert'
import {getLinkTemplateByIdOrDefault} from '../src/settings'
import {defaultLinkTemplates} from '../src/linkTemplates'
import {resetLogseqPluginSettings, setLogseqPluginSettings} from './logseqTestUtils'

describe('getLinkTemplateByIdOrDefault test', () => {
    afterEach(() => resetLogseqPluginSettings())

    it('Should get a template for movie', () => {
        setLogseqPluginSettings({'link.text.movie': 'Movie {title}, year: ${year}'})
        const actual = getLinkTemplateByIdOrDefault('movie')
        assert.equal(actual, 'Movie {title}, year: ${year}')
    })

    it('Should get a template for anime', () => {
        setLogseqPluginSettings({'link.text.anime': 'Anime {title}, year: ${year}'})
        const actual = getLinkTemplateByIdOrDefault('anime')
        assert.equal(actual, 'Anime {title}, year: ${year}')
    })

    it('Should get a default movie template for undefined settings', () => {
        setLogseqPluginSettings(undefined)
        const actual = getLinkTemplateByIdOrDefault('movie')
        assert.equal(actual, defaultLinkTemplates['movie'])
    })

    it('Should get a default anime template for undefined settings', () => {
        setLogseqPluginSettings(undefined)
        const actual = getLinkTemplateByIdOrDefault('anime')
        assert.equal(actual, defaultLinkTemplates['anime'])
    })

    it('Should get a default movie template for undefined specific setting', () => {
        setLogseqPluginSettings({'link.text.movie': undefined})
        const actual = getLinkTemplateByIdOrDefault('movie')
        assert.equal(actual, defaultLinkTemplates['movie'])
    })

    it('Should get a default anime template for undefined specific setting', () => {
        setLogseqPluginSettings({'link.text.anime': undefined})
        const actual = getLinkTemplateByIdOrDefault('anime')
        assert.equal(actual, defaultLinkTemplates['anime'])
    })
})




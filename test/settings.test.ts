import assert from 'assert'
import {getLinkTemplateByIdOrDefault, SettingId} from '../src/settings'
import {defaultLinkTemplates} from '../src/linkTemplates'

describe('getLinkTemplateByIdOrDefault test', () => {
    afterEach(() => resetSettings())

    it('Should get a template for movie', () => {
        setSettings({'link.text.movie': 'Movie {title}, year: ${year}'})
        const actual = getLinkTemplateByIdOrDefault('movie')
        assert.equal(actual, 'Movie {title}, year: ${year}')
    })

    it('Should get a template for anime', () => {
        setSettings({'link.text.anime': 'Anime {title}, year: ${year}'})
        const actual = getLinkTemplateByIdOrDefault('anime')
        assert.equal(actual, 'Anime {title}, year: ${year}')
    })

    it('Should get a default movie template for undefined settings', () => {
        setSettings(undefined)
        const actual = getLinkTemplateByIdOrDefault('movie')
        assert.equal(actual, defaultLinkTemplates['movie'])
    })

    it('Should get a default anime template for undefined settings', () => {
        setSettings(undefined)
        const actual = getLinkTemplateByIdOrDefault('anime')
        assert.equal(actual, defaultLinkTemplates['anime'])
    })

    it('Should get a default movie template for undefined specific setting', () => {
        setSettings({'link.text.movie': undefined})
        const actual = getLinkTemplateByIdOrDefault('movie')
        assert.equal(actual, defaultLinkTemplates['movie'])
    })

    it('Should get a default anime template for undefined specific setting', () => {
        setSettings({'link.text.anime': undefined})
        const actual = getLinkTemplateByIdOrDefault('anime')
        assert.equal(actual, defaultLinkTemplates['anime'])
    })
})



function setSettings(settings: { [_ in SettingId]?: string | undefined } | undefined) {
    // @ts-ignore
    global.logseq = {settings: settings}
}

function resetSettings() {
    // @ts-ignore
    global.logseq = undefined
}
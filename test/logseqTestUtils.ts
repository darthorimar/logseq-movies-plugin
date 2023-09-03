import {SettingId} from '../src/settings'

export function setLogseqPluginSettings(settings: { [_ in SettingId]?: string | undefined } | undefined) {
    // @ts-ignore
    global.logseq = {settings: settings}
}

export function resetLogseqPluginSettings() {
    // @ts-ignore
    global.logseq = undefined
}

export function setLogseqPluginSettingsMovieTemplate(template: string | undefined) {
    updateLogseqPluginSettings({'link.text.movie': template})
}

export function setLogseqPluginSettingsAnimeTemplate(template: string | undefined) {
    updateLogseqPluginSettings({'link.text.anime': template})
}


export function updateLogseqPluginSettings(settings: { [_ in SettingId]?: string | undefined }) {
    if (!global.logseq?.settings) {
        setLogseqPluginSettings(settings)
    } else {
        setLogseqPluginSettings({
            ...global.logseq.settings,
            ...settings
        })
    }
}
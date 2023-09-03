import {SettingId} from '../src/settings'

export function setLogseqPluginSettings(settings: { [_ in SettingId]?: string | undefined } | undefined) {
    // @ts-ignore
    global.logseq = {settings: settings}
}

export function resetLogseqPluginSettings() {
    // @ts-ignore
    global.logseq = undefined
}

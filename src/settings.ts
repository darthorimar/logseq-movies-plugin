import {defaultLinkTemplates, LinkTemplateId, supportedTemplateEntries} from './linkTemplates'
import {SettingSchemaDesc} from '@logseq/libs/dist/LSPlugin'

export type SettingId = 'link.text.movie' | 'link.text.anime'

/**
 * Retrieves the link template associated with the provided templateId, or a default value if not found.
 *
 * @param templateId - The identifier of the link template to retrieve.
 * @returns - The link template associated with the templateId, or a default value if not found.
 */
export function getLinkTemplateByIdOrDefault(templateId: LinkTemplateId): string {
    const settings = logseq.settings
    if (!settings) return defaultLinkTemplates[templateId]
    const settingId = settingIdByTemplateId[templateId]
    return settings[settingId] ?? defaultLinkTemplates[templateId]
}

interface PluginSettingSchema extends SettingSchemaDesc {
    key: SettingId;
}

export const settingSchema: Array<PluginSettingSchema> = [
    {
        key: 'link.text.movie',
        type: 'string',
        default: defaultLinkTemplates.movie,
        title: 'Movie Link Text',
        description: supportedTemplateEntries,
    },
    {
        key: 'link.text.anime',
        type: 'string',
        default: defaultLinkTemplates.movie,
        title: 'Anime Link Text',
        description: supportedTemplateEntries,
    },
]

export const settingIdByTemplateId: { [_ in LinkTemplateId]: SettingId } = {
    'movie': 'link.text.movie',
    'anime': 'link.text.anime',
}

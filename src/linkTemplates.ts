import {Item} from './Item'

export type LinkTemplateId = 'movie' | 'anime'

export const defaultLinkTemplates: { [_ in LinkTemplateId]: string } = {
    'movie': '🎬 ${title}',
    'anime': '🎬 ${title}',
}

export const supportedTemplateEntries: string =
    'Supported template entries: <code>${title}</code>, <code>${year}</code>'

/**
 * Applies the provided template to an item.
 *
 * Does not work properly for item which may contain template entries.
 *
 * @param template - The template string that contains entries, see {@link supportedTemplateEntries}
 * @param item - The item object used to replace the placeholders in the template.
 * @returns The modified template string with placeholders replaced by item properties.
 */
export function applyLinkTemplate(template: string, item: Item): string {
    return template
        .replaceAll('${title}', item.title)
        .replaceAll('${year}', item.year)
}

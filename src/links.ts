import {Item} from './Item'
import {applyLinkTemplate, LinkTemplateId} from './linkTemplates'
import {getLinkTemplateByIdOrDefault} from './settings'

export function createLinkByItem(item: Item, templateId: LinkTemplateId, format: 'markdown' | 'org'): string {
    const template = getLinkTemplateByIdOrDefault(templateId)
    const linkText = applyLinkTemplate(template, item)
    const link = item.link
    return createLink(format, linkText, link)
}

function createLink(format: 'markdown' | 'org', linkText: string, link: string) {
    switch (format) {
    case 'markdown':
        return `[${linkText}](${link})`
    case 'org':
        return `[[${link}][${linkText}]]`
    }
}
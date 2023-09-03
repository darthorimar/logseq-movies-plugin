import {Item} from './Item'
import {applyLinkTemplate, LinkTemplateId} from './linkTemplates'
import {getLinkTemplateByIdOrDefault} from './settings'

export function createLink(item: Item, templateId: LinkTemplateId, format: 'markdown' | 'org'): string {
    const template = getLinkTemplateByIdOrDefault(templateId)
    const linkText = applyLinkTemplate(template, item)
    switch (format) {
    case 'markdown':
        return `[${linkText}](${item.link})`
    case 'org':
        return `[[${item.link}][${linkText}]]`
    }
}
import {Item} from './Item'
import {LinkTemplateId} from './linkTemplates'
import {createLinkByItem} from './links'

/**
 * Remove all special chars from the text transforming it tho the space-separated list of words
 * @param text text to transform
 */
export function tokenize(text: string): string {
    let words = text.match(/\p{L}+|\d+/giu)
    if (!words) return ''
    return words.join(' ')
}

/**
 * Insert `Item` as a link inside a current block at cursor position
 * @param item item to insert into the block
 * @param templateId template id to use for the inserted link text
 * @param format format of the link to insert, possible values are `markdown` and `org`
 */
export async function insertItemAtCursor(item: Item, templateId: LinkTemplateId, format: Format): Promise<void> {
    const link = createLinkByItem(item, templateId, format)
    await logseq.Editor.insertAtEditingCursor(link)
}

export function parseMyAnimeListYear(aired: any | null): string | null {
    if (!aired) return null
    const from = getYearFromDate(aired.from)
    if (!from) return null
    const to = getYearFromDate(aired.to)
    return !to || from == to ? `${from}` : `${from} — ${to}`
}

function getYearFromDate(date: string | null): number | null {
    if (!date) return null
    try {
        const dateObject = new Date(date)
        if (!dateObject) return null
        return dateObject.getFullYear()
    } catch (_) {
        return null
    }
}


declare global {
    export interface Array<T> {
        filterOutNullable(): Array<NonNullable<T>>;
    }
}

export type Format = 'markdown' | 'org'

Array.prototype.filterOutNullable = function () {
    return this.filter(v => typeof v !== 'undefined' && v !== null)
}
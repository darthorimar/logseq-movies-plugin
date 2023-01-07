import {BlockEntity} from '@logseq/libs/dist/LSPlugin'
import {Item} from './Item'

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
 * @param icon icon to before `Item` title
 * @param format format of the link to insert, possible values are `markdown` and `org`
 */
export async function insertItemAtCursor(item: Item, icon: string | null, format: Format): Promise<void> {
    const link = createLink(item, icon, format)
    await logseq.Editor.insertAtEditingCursor(link)
}

function createLink(item: Item, icon: string | null, format: 'markdown' | 'org'): string {
    const iconPrefix = icon == null ? '' : icon + ' '
    switch (format) {
    case 'markdown':
        return `[${iconPrefix}${item.title}](${item.link})`
    case 'org':
        return `[[${item.link}][${iconPrefix}${item.title}]]`
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
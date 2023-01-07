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
 * Insert `Item` as a link inside block
 * @param block logseq block to insert the item
 * @param item item to insert into the block
 * @param icon icon to before `Item` title
 */
export async function insertItemToBlock(block: BlockEntity, item: Item, icon: string | null): Promise<void> {
    const link = createLink(item, icon, block.format)
    await logseq.Editor.updateBlock(block.uuid, block.content + link)
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

Array.prototype.filterOutNullable = function () {
    return this.filter(v => typeof v !== 'undefined' && v !== null)
}
import '@logseq/libs'
import {Item} from './Item'
import {updateThemeToCurrentUserStyle} from './Theme'

/**
 * UI control for choosing items via completed entries
 */
export class ItemChooser {
    private session: ItemChooserSession | null = null
    private ui: ItemChooserUi = new ItemChooserUi()

    private static _instance: ItemChooser

    public static get instance(): ItemChooser {
        if (!ItemChooser._instance) {
            ItemChooser._instance = new ItemChooser()
        }

        return ItemChooser._instance
    }

    /**
     * Initialize the `ItemChooser` UI
     */
    public async init() {
        await updateThemeToCurrentUserStyle()

        this.ui.getInputField().addEventListener('input', () => this.updateItems())

        this.ui.getCompletionList().addEventListener('click', (e) => {
            if (!this.session) return
            const selectedItemIndex = this.ui.getSelectedItemIndex(e)
            if (!selectedItemIndex) return
            this.onSelected(selectedItemIndex)
        })

        document.addEventListener('keydown', (e) => this.handleKeyboardInput(e.key), false)
    }

    /**
     * Show `ItemChooser` and populate with results provided by `getCompletionItems`
     *
     * @param title title for the user is searching for, will be shown as input placeholder
     * @param icon will be shown on the left side of the input field
     * @param getCompletionItems completion items retriever by user input
     * @param onSelected  will be called when user selects some item
     * @param onHidden called when the item is hidden
     */
    public async show(
        title: string,
        icon: string,
        getCompletionItems: (text: string) => Promise<Item[] | null>,
        onSelected: (item: Item) => void,
        onHidden: () => void,
    ) {
        this.session = {
            getCompletionItems: getCompletionItems,
            activeItemIndex: 0,
            items: [],
            onSelected: onSelected,
        }
        await updateThemeToCurrentUserStyle()
        await this.ui.show(title, icon)
        logseq.showMainUI()
        setTimeout(() => this.ui.getInputField().focus(), 100)
    }

    private handleKeyboardInput(key: string) {
        const session = this.session
        if (!session) return

        switch (key) {
        case 'Escape':
            this.hide()
            break

        case 'ArrowUp':
            session.activeItemIndex = (session.activeItemIndex - 1 + session.items.length) % session.items.length
            this.highlightActive()
            break

        case 'ArrowDown':
            session.activeItemIndex = (session.activeItemIndex + 1) % session.items.length
            this.highlightActive()
            break

        case 'Enter':
            this.onSelected(session.activeItemIndex)
            break
        }
    }

    private onSelected(index: number) {
        let session = this.session
        if (!session) return
        session.onSelected(session.items[index])
        this.hide()
    }

    private highlightActive() {
        const session = this.session
        if (!session) return
        if (session.items.length == 0) return
        this.ui.getItemChooser().querySelectorAll('.active').forEach((e: Element) => e.classList.remove('active'))
        this.ui.getItemChooser().querySelectorAll('.list-item')[session.activeItemIndex].classList.add('active')
    }

    private async updateItems() {
        const session = this.session
        if (!session) return
        const items = await session.getCompletionItems(this.ui.getInputField().value)
            .then((items) => !items ? [] : items)
        session.items = items
        this.ui.updateCompletionList(items)
        this.highlightActive()
    }

    private hide() {
        logseq.hideMainUI({restoreEditingCursor: true})
        this.ui.reset()
        this.session = null
    }
}

class ItemChooserUi {
    updateCompletionList(items: Item[]) {
        this.getCompletionList().innerHTML = items.map((e: Item) => {
                const yearString = e.year ? ` (${e.year})` : ''
                return `<li class="list-item">${e.title}${yearString}</li>`
            }
        ).join(' ')
    }

    async show(title: string, icon: string) {
        let position = await logseq.Editor.getEditingCursorPosition()
        if (!position) return
        const {left, top, rect} = position
        Object.assign(this.getItemChooser().style, {top: top + rect.top + 'px', left: left + rect.left + 'px'})
        this.getInputField().setAttribute('placeholder', title)
        this.getSearchIcon().innerText = icon
    }

    reset() {
        this.getCompletionList().innerHTML = ''
        this.getInputField().value = ''
    }

    getSelectedItemIndex(e: MouseEvent): number | null {
        const selectedLiElement = (e.target as Element).closest('li')
        if (!selectedLiElement) return null
        const selectedLiElementIndex = Array.from(this.getCompletionList().children).indexOf(selectedLiElement)
        if (selectedLiElementIndex < 0) return null
        return selectedLiElementIndex
    }

    getItemChooser(): HTMLElement {
        return document.getElementById('item-chooser')!
    }

    getCompletionList(): HTMLElement {
        return document.getElementById('completion-list')!
    }

    getInputField(): HTMLInputElement {
        return document.getElementById('search-box') as HTMLInputElement
    }

    getSearchIcon(): HTMLElement {
        return document.getElementById('search-icon')!
    }
}


interface ItemChooserSession {
    getCompletionItems: (text: string) => Promise<Item[] | null>
    items: Item[],
    activeItemIndex: number,
    onSelected: (item: Item) => void,
}
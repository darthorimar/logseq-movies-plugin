/**
 * Retrieve current user theme style(dark/light) and apply it the plugin UI
 */
export async function updateThemeToCurrentUserStyle() {
    const theme = await getCurrentUserStyle()
    updateTheme(theme)
}

function updateTheme(theme: ColorTheme) {
    for (const [property, value] of Object.entries(theme)) {
        document.documentElement.style.setProperty(`--${property}`, value)
    }
}


async function getCurrentUserStyle() {
    const userConfigs = await logseq.App.getUserConfigs()
    const themeType: ThemeType = userConfigs.preferredThemeMode
    return themes[themeType]
}

interface ColorTheme {
    shadow: string;
    hover: string;
    background: string;
    text: string;
    active: string;
}

type ThemeType = 'dark' | 'light'


const themes: Record<ThemeType, ColorTheme> = {
    'light': {
        'text': '#7b808d',
        'background': '#ebeff4',
        'shadow': '#d8dee9',
        'hover': '#e2e6ee',
        'active': '#dbe1ec',
    },
    'dark': {
        'text': '#e4e7eb',
        'background': '#1e2228',
        'shadow': '#131517',
        'hover': '#242932',
        'active': '#303542',
    },
}


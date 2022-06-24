// saves the user preference for dark mode but if a change is made to the system theme,
// then it overrides the users choice (unless they change it back)

const userSetDarkMode = localStorage.getItem('theme')
const systemSetDarkMode = matchMedia('(prefers-color-scheme: dark)')

let isDarkMode = userSetDarkMode ? userSetDarkMode === 'dark' : systemSetDarkMode.matches

const setScheme = () => {

    const root = document.querySelector(':root')
    const scheme = isDarkMode ? 'dark' : 'light'

    localStorage.setItem('theme', scheme)

    root.setAttribute('color-scheme', scheme)
}

setScheme()
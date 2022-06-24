const themeToggler = document.querySelector('input.theme')

onload = () => {

    if (!themeToggler) return

    themeToggler.checked = isDarkMode

    themeToggler.onchange = () => {
        isDarkMode = themeToggler.checked
        setScheme()
    }
    
    systemSetDarkMode.onchange = (e) => {
        themeToggler.checked = e.matches
        setScheme()
    }   
}


// setScheme()
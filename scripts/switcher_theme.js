const switcherThemeEl = document.querySelector('.switcher-theme');

switcherThemeEl.addEventListener('click', () => {

    document.body.classList.toggle('light');
    switcherThemeEl.classList.toggle('moon');

});

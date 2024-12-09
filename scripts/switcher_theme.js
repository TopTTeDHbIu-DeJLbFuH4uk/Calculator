const switcherThemeEl = document.querySelector('.switcher-theme');

switcherThemeEl.addEventListener('click', () => {

    document.body.classList.toggle('light-theme');
    switcherThemeEl.classList.toggle('moon');

});

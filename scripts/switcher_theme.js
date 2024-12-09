const switcherThemeEl = document.querySelector('.switcher-theme');

switcherThemeEl.addEventListener('click', () => {

    document.body.classList.toggle('overlay-light');
    switcherThemeEl.classList.toggle('moon');

});

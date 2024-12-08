const darkModeEl = document.querySelector('.dark-mode');
const switcherTheme = document.querySelector('.switcher-theme');

switcherTheme.addEventListener('click', () => {

   if (darkModeEl.getAttribute('href') === 'styles/dark_mode.css') {
      darkModeEl.setAttribute('href', 'styles/light_mode.css');
   } else {
      darkModeEl.setAttribute('href', 'styles/dark_mode.css');
   }

});

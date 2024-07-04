const ribbon = document.getElementById('ribbon');
const menu = document.getElementById('menu')
const sideNav = document.getElementById('side-nav');
ribbon.addEventListener('click', () => sideNav.style.display = 'none');
menu.addEventListener('click', () => sideNav.style.display = 'block');
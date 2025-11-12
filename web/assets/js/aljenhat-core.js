document.addEventListener('DOMContentLoaded', function () {
    const headerMenu = document.querySelector('.header-menu')
    const headerMenuClose = document.querySelector('.header-menu-close')
    const bars3 = document.querySelector('.bars3')
  
    if (!headerMenu || !headerMenuClose || !bars3) return
  
    const isDesktop = () => window.innerWidth >= 1024
  
    const openMenu = () => {
      if (isDesktop()) {
        headerMenu.style.visibility = 'visible'
        headerMenu.style.opacity = '1'
      } else {
        headerMenu.style.transform = 'translateX(0)'
      }
      document.body.classList.add('overflow-hidden')
    }
  
    const closeMenu = () => {
      if (isDesktop()) {
        headerMenu.style.visibility = 'hidden'
        headerMenu.style.opacity = '0'
      } else {
        headerMenu.style.transform = 'translateX(-1024px)'
      }
      document.body.classList.remove('overflow-hidden')
    }
  
    bars3.addEventListener('click', openMenu)
    headerMenuClose.addEventListener('click', closeMenu)
  
    headerMenu.addEventListener('click', (e) => {
      const toggle = e.target.closest('.toggle-dropdown')
      if (!toggle) return
  
      const submenu = toggle.nextElementSibling
      if (!submenu) return
  
      const dropdownIcon = toggle.querySelector('.dropdown-icon')
      const isOpen = submenu.style.maxHeight
  
      if (isOpen) {
        submenu.style.maxHeight = null
        submenu.style.opacity = '0'
      } else {
        submenu.style.maxHeight = submenu.scrollHeight * 30 + 'px'
        submenu.style.opacity = '1'
      }
  
      if (dropdownIcon) dropdownIcon.classList.toggle('rotate-180')
  
      e.stopPropagation()
    })
  })
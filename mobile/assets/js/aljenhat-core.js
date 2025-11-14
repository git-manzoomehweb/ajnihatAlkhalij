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
  });

  (function () {
    const btn = document.getElementById('shareBtn')
    const menu = document.getElementById('shareMenu')
    const wrap = document.getElementById('shareWrap')
  
    function getSharePayload() {
      const title = btn.dataset.title?.trim() || document.title
      const text = btn.dataset.text?.trim() || document.title
      const url =
        (btn.dataset.url && btn.dataset.url.trim()) || window.location.href
      return { title, text, url }
    }
  
    function setFallbackLinks() {
      const { title, text, url } = getSharePayload()
      const encodedUrl = encodeURIComponent(url)
      const encodedTitle = encodeURIComponent(title)
      const encodedText = encodeURIComponent(text)
  
      const tg = document.getElementById('shareTelegram')
      tg.href = `https://t.me/share/url?url=${encodedUrl}&text=${
        encodedText || encodedTitle
      }`
  
      const tw = document.getElementById('shareTwitter')
      tw.href = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${
        encodedText || encodedTitle
      }`
  
      const wa = document.getElementById('shareWhatsapp')
      wa.href = `https://api.whatsapp.com/send?text=${
        encodedText || encodedTitle
      }%20${encodedUrl}`
    }
  
    function openMenu() {
      setFallbackLinks()
      menu.classList.remove('invisible', 'pointer-events-none', 'opacity-0')
      menu.classList.add('opacity-100')
      btn.setAttribute('aria-expanded', 'true')
    }
    function closeMenu() {
      menu.classList.add('opacity-0')
      menu.classList.remove('opacity-100')
      setTimeout(() => {
        menu.classList.add('invisible', 'pointer-events-none')
      }, 200)
      btn.setAttribute('aria-expanded', 'false')
    }
  
    btn?.addEventListener('click', async (e) => {
      e.preventDefault()
      const payload = getSharePayload()
  
      if (navigator.share) {
        try {
          await navigator.share({
            title: payload.title,
            text: payload.text,
            url: payload.url,
          })
          return
        } catch (err) {
          openMenu()
        }
      } else {
        openMenu()
      }
    })
  
    document.addEventListener('click', (e) => {
      if (wrap && !wrap.contains(e.target)) closeMenu()
    })
  
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu()
    })
  })()

  document.addEventListener('DOMContentLoaded', function () {
    const content = document.querySelector('.content-inner')
    const button = document.querySelector('.see-more')
    let expanded = false
  
    content.style.height = '140px'
    content.style.overflow = 'hidden'
    content.style.transition = 'height 0.5s ease'
  
    button.addEventListener('click', function () {
      if (!expanded) {
        content.style.height = content.scrollHeight + 'px'
        button.textContent = 'See less'
      } else {
        content.style.height = '140px'
        button.textContent = 'Learn more'
      }
      expanded = !expanded
    })
  })
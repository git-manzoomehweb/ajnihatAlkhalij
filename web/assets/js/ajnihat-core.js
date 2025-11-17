document.addEventListener('DOMContentLoaded', function () {
  const isDesktop = window.innerWidth > 1024
  const requiredFiles = isDesktop
    ? ['ajnihat.ui.min.css']
    : ['ajnihat-mob.ui.min.css']

  function checkAllResourcesLoaded() {
    const resources = performance.getEntriesByType('resource')
    const loadedFiles = resources
      .map((res) => res.name.split('/').pop())
      .filter((name) => requiredFiles.includes(name))

    return requiredFiles.every((file) => loadedFiles.includes(file))
  }

  if (document.getElementById('search-box')) {
    function fetchEngine() {
      try {
        const xhrobj = new XMLHttpRequest()
        xhrobj.open('GET', 'search-engine.bc')
        xhrobj.send()

        xhrobj.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            const container = document.getElementById('search-box')
            container.innerHTML = xhrobj.responseText
            ;['.Basis_Date.end_date', '.Basis_Date.start_date'].forEach(
              (selector) => {
                const dateInputs = document.querySelectorAll(selector)
                dateInputs.forEach((input) => {
                  input.placeholder = ''
                })
              },
            )

            const r = document.querySelector('.flighttype-field')
            r.classList.add('flighttype-dropDown')

            const scripts = container.getElementsByTagName('script')
            for (let i = 0; i < scripts.length; i++) {
              const scriptTag = document.createElement('script')
              if (scripts[i].src) {
                scriptTag.src = scripts[i].src
                scriptTag.async = false
              } else {
                scriptTag.text = scripts[i].textContent
              }
              document.head
                .appendChild(scriptTag)
                .parentNode.removeChild(scriptTag)
            }
          }
        }
      } catch (error) {
        console.error('مشکلی پیش آمده است. لطفا صبور باشید', error)
      }
    }

    function waitForFiles() {
      if (checkAllResourcesLoaded()) {
        fetchEngine()
      } else {
        setTimeout(waitForFiles, 500)
      }
    }
    waitForFiles()
  }
})

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

  if (!content || !button) return;
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

function setupArticleSearch() {
  const searchInput = document.querySelector(".search-blog");
  const searchButton = document.querySelector(".article-search-button");
  const articleCards = document.querySelectorAll(".article-card");

  if (!searchInput || !searchButton || articleCards.length === 0) {
    console.warn("⛔ Search setup skipped: elements not found");
    return;
  }

  searchButton.addEventListener("click", function () {
    const searchTerm = searchInput.value.toLowerCase();
    let anyVisible = false;

    articleCards.forEach((card) => {
      const articleName = (
        card.getAttribute("data-name") || ""
      ).toLowerCase();
      const match = articleName.includes(searchTerm);
      card.style.display = match ? "" : "none";
      if (match) anyVisible = true;
    });

    const fetchContent = document.querySelector(".fetch-content-article");
    const cardWrapper = fetchContent.querySelector(".article-card-wrapper");
    const paging = fetchContent.querySelector("#paging");

    if (cardWrapper && paging) {
      const visibleCards = cardWrapper.querySelectorAll(
        ".article-card:not([style*='display: none'])"
      );
      paging.style.display = visibleCards.length === 0 ? "none" : "";
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const fetchContentArticle = document.querySelector(".fetch-content-article");
  const buttons = document.querySelectorAll(".article-fetch-btn");

  if (!fetchContentArticle || buttons.length === 0) return;

  const articleCache = {};
  let currentCatid = null;

  function highlightSelected(activeBtn) {
    buttons.forEach((btn) => {
      btn.style.backgroundColor = "";
      btn.style.color = "";
      btn.style.borderColor = "";
    });

    if (activeBtn) {
      activeBtn.style.backgroundColor = "var(--primary-900)";
      activeBtn.style.color = "#FFFFFF";
      activeBtn.style.borderColor = "var(--primary-900)";
    }
  }

  async function fetchArticleContent(catid) {
    if (currentCatid === catid && articleCache[catid]) {
      return;
    }

    currentCatid = catid;

    if (articleCache[catid]) {
      fetchContentArticle.innerHTML = articleCache[catid];

      if (typeof applyImageFallbacks === "function") {
        applyImageFallbacks(fetchContentArticle);
      }

      if (typeof setupArticleSearch === "function") {
        setupArticleSearch();
      }

      return;
    }

    fetchContentArticle.innerHTML = `
      <div class="w-full flex justify-center mt-10">
        <span class="fetch-loader"></span>
      </div>
    `;

    try {
      const response = await fetch(`/article-load-items.bc?catid=${catid}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.text();

      articleCache[catid] = data;
      fetchContentArticle.innerHTML = data;

      if (typeof applyImageFallbacks === "function") {
        applyImageFallbacks(fetchContentArticle);
      }

      if (typeof setupArticleSearch === "function") {
        setupArticleSearch();
      }
    } catch (error) {
      fetchContentArticle.innerHTML =
        "<p>Error loading data: " + error.message + "</p>";
    }
  }

  const hardcodedDefaultCatid = "215683"; 
  let defaultBtn =
    Array.from(buttons).find(
      (btn) => btn.dataset.id === hardcodedDefaultCatid
    ) || buttons[0];

  if (defaultBtn) {
    const defaultCatid = defaultBtn.dataset.id;
    highlightSelected(defaultBtn);
    fetchArticleContent(defaultCatid);
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const catid = this.dataset.id;
      if (!catid) return;

      highlightSelected(this);
      fetchArticleContent(catid);
    });
  });
});

// paging 
const fetchArticlePage = async (pageNum) => {
  const fetchContentArticle = document.querySelector(".fetch-content-article");
  if (!fetchContentArticle) return;

  const catId = fetchContentArticle.dataset.catid;
  if (!catId) return;

  fetchContentArticle.innerHTML = `
    <div class="w-full flex justify-center mt-10">
      <span class="fetch-loader"></span>
    </div>
  `;

  try {
    const response = await fetch(`/article-load-items.bc?catid=${catId}&pagenum=${pageNum}`);
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

    const data = await response.text();
    fetchContentArticle.innerHTML = data;

    if (typeof applyImageFallbacks === "function") {
      applyImageFallbacks(fetchContentArticle);
    }
    if (typeof setupArticleSearch === "function") {
      setupArticleSearch();
    }

  } catch (err) {
    fetchContentArticle.innerHTML = `<p>Error: ${err.message}</p>`;
  }
};

// footer-form
function uploadDocumentFooter(args) {
  document.querySelector("#footer-form .Loading_Form").style.display = "block";
  const captcha = document
    .querySelector("#footer-form")
    .querySelector("#captchaContainer input[name='captcha']").value;
  const captchaid = document
    .querySelector("#footer-form")
    .querySelector("#captchaContainer input[name='captchaid']").value;
  const stringJson = JSON.stringify(args.source?.rows[0]);
  $bc.setSource("cms.uploadFooter", {
    value: stringJson,
    captcha: captcha,
    captchaid: captchaid,
    run: true,
  });
}

function refreshCaptchaFooter(e) {
  $bc.setSource("captcha.refreshFooter", true);
}

async function OnProcessedEditObjectFooter(args) {
  var response = args.response;
  var json = await response.json();
  var errorid = json.errorid;
  if (errorid == "6") {
    document.querySelector("#footer-form .Loading_Form").style.display = "none";
    document.querySelector("#footer-form .message-api").innerHTML =
      "Your request has been successfully submitted.";
    document.querySelector("#footer-form .message-api").style.color =
      "rgb(10 240 10)";
  } else {
    refreshCaptchaFooter();
    setTimeout(() => {
      document.querySelector("#footer-form .Loading_Form").style.display =
        "none";
      document.querySelector("#footer-form .message-api").innerHTML =
        "An error occurred, please try again.";
      document.querySelector("#footer-form .message-api").style.color =
        "rgb(220 38 38)";
    }, 2000);
  }
}

async function RenderFormFooter() {
  var inputElementVisa7 = document.querySelector(
    " .footer-username input[data-bc-text-input]"
  );
  inputElementVisa7.setAttribute("placeholder", "First name / Last name");
  var inputElementVisa7 = document.querySelector(
    " .footer-email input[data-bc-text-input]"
  );
  inputElementVisa7.setAttribute("placeholder", "Email");
}

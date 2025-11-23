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

  content.style.height = '320px'
  content.style.overflow = 'hidden'
  content.style.transition = 'height 0.5s ease'

  button.addEventListener('click', function () {
    if (!expanded) {
      content.style.height = content.scrollHeight + 'px'
      button.textContent = 'See less'
    } else {
      content.style.height = '320px'
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

  const runSearch = () => {
    const searchTerm = (searchInput.value || "").toLowerCase().trim();
    let anyVisible = false;

    articleCards.forEach((card) => {
      const articleName = (card.getAttribute("data-name") || "").toLowerCase();
      const match = !searchTerm || articleName.includes(searchTerm);

      card.style.display = match ? "" : "none";
      if (match) anyVisible = true;
    });

    const fetchContent = document.querySelector(".fetch-content-article");
    if (!fetchContent) return;

    const cardWrapper = fetchContent.querySelector(".article-card-wrapper");
    const paging = fetchContent.querySelector("#paging");

    if (cardWrapper && paging) {
      const visibleCards = cardWrapper.querySelectorAll(
        ".article-card:not([style*='display: none'])"
      );
      paging.style.display = visibleCards.length === 0 ? "none" : "";
    }
  };

  searchButton.addEventListener("click", function () {
    runSearch();
  });

  searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      runSearch();
    }
  });
}

// fetch-content-article
document.addEventListener("DOMContentLoaded", function () {
  const fetchContentArticle = document.querySelector(".fetch-content-article");
  const buttons = document.querySelectorAll(".article-fetch-btn");

  if (!fetchContentArticle || buttons.length === 0) return;

  const articleCache = {};
  let currentCatid = null;

  function highlightSelected(activeBtn) {
    buttons.forEach((btn) => {
      btn.classList.remove("is-active");
      btn.style.backgroundColor = "";
      btn.style.color = "";
      btn.style.borderColor = "";
    });

    if (activeBtn) {
      activeBtn.classList.add("is-active");
      activeBtn.style.backgroundColor = "var(--primary-900)";
      activeBtn.style.color = "#FFFFFF";
      activeBtn.style.borderColor = "var(--primary-900)";
    }
  }

  async function fetchArticleContent(catid) {
    if (articleCache[catid]) {
      currentCatid = catid;
      fetchContentArticle.innerHTML = articleCache[catid];
  
      if (typeof setupArticleSearch === "function") {
        setupArticleSearch();
      }

      if (typeof setupPaging === "function") {
        setupPaging(); 
      }
  
      return;
    }
  
    currentCatid = catid;
  
    const loaderHTML = `
      <div class="w-full h-full flex items-center justify-center">
        <span class="fetch-loader"></span>
      </div>
    `;
  
    const loaderTimeout = setTimeout(() => {
      fetchContentArticle.innerHTML = loaderHTML;
    }, 200);
  
    try {
      const response = await fetch(
        `/load-items.bc?fetch=article&catid=${encodeURIComponent(catid)}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.text();
  
      clearTimeout(loaderTimeout);
      articleCache[catid] = data;
      fetchContentArticle.innerHTML = data;

  
      if (typeof setupArticleSearch === "function") {
        setupArticleSearch();
      }

      if (typeof setupPaging === "function") {
        setupPaging(); 
      }
    } catch (error) {
      clearTimeout(loaderTimeout);
      fetchContentArticle.innerHTML =
        "<p>Error loading data: " + error.message + "</p>";
    }
  }

  const defaultBtn = buttons[0];

  if (defaultBtn) {
    const defaultCatid = defaultBtn.dataset.id;
    highlightSelected(defaultBtn);
    if (defaultCatid) {
      fetchArticleContent(defaultCatid);
    }
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
const getSelectedCatId = () => {
  let activeBtn = document.querySelector(".article-fetch-btn.is-active");
  if (!activeBtn) {
    activeBtn = document.querySelector(".article-fetch-btn");
  }
  return activeBtn ? activeBtn.dataset.id : null;
};

const fetchArticlePage = async (dataPageNum) => {
  const fetchContentArticle = document.querySelector(".fetch-content-article");
  if (!fetchContentArticle) return;

  const cmsQuery = getSelectedCatId();
  if (!cmsQuery) return;

  const loaderHTML = `
    <div class="w-full h-full flex items-center justify-center">
      <span class="fetch-loader"></span>
    </div>
  `;

  const loaderTimeout = setTimeout(() => {
    fetchContentArticle.innerHTML = loaderHTML;
  }, 200);

  try {
    const pagingResponse = await fetch(
      `/load-items.bc?fetch=article&catid=${encodeURIComponent(
        cmsQuery
      )}&pagenum=${dataPageNum}`
    );
    
    if (!pagingResponse.ok) {
      throw new Error(`HTTP error! Status: ${pagingResponse.status}`);
    }

    const pagingData = await pagingResponse.text();

    clearTimeout(loaderTimeout);
    fetchContentArticle.innerHTML = pagingData;

    if (typeof setupArticleSearch === "function") {
      setupArticleSearch();
    }

    if (typeof setupPaging === "function") {
      setupPaging(Number(dataPageNum)); 
    }
  } catch (error) {
    clearTimeout(loaderTimeout);
    fetchContentArticle.innerHTML =
      "<p>Error loading data: " + error.message + "</p>";
  }
};

//fetch-content-faq
document.addEventListener("DOMContentLoaded", function () {
  const faqContainer = document.querySelector(".fetch-content-faq");
  const faqButtons = document.querySelectorAll(".faq-fetch-btn");

  if (!faqContainer || faqButtons.length === 0) return;

  const faqCache = {};
  let currentFaqId = null;

  function highlightSelectedFaq(activeBtn) {
    faqButtons.forEach((btn) => {
      btn.classList.remove("is-active");
      btn.style.backgroundColor = "";
      btn.style.color = "";
      btn.style.borderColor = "";
    });

    if (activeBtn) {
      btn = activeBtn;
      btn.classList.add("is-active");
      btn.style.backgroundColor = "var(--primary-900)";
      btn.style.color = "#FFFFFF";
      btn.style.borderColor = "var(--primary-900)";
    }
  }

  async function fetchFaqContent(id) {
    if (faqCache[id]) {
      currentFaqId = id;
      faqContainer.innerHTML = faqCache[id];
      return;
    }

    currentFaqId = id;

    const loaderHTML = `
      <div class="w-full h-full flex items-center justify-center">
        <span class="fetch-loader"></span>
      </div>
    `;

    const loaderTimeout = setTimeout(() => {
      faqContainer.innerHTML = loaderHTML;
    }, 200);

    try {
      const response = await fetch(
        `/load-items.bc?fetch=faq&id=${encodeURIComponent(id)}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.text();

      clearTimeout(loaderTimeout);
      faqCache[id] = data;
      faqContainer.innerHTML = data;
    } catch (error) {
      clearTimeout(loaderTimeout);
      faqContainer.innerHTML =
        "<p>Error loading data: " + error.message + "</p>";
    }
  }

  const defaultFaqBtn = faqButtons[0];

  if (defaultFaqBtn) {
    const defaultId = defaultFaqBtn.dataset.id;
    highlightSelectedFaq(defaultFaqBtn);
    if (defaultId) {
      fetchFaqContent(defaultId);
    }
  }

  faqButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = this.dataset.id;
      if (!id) return;

      highlightSelectedFaq(this);
      fetchFaqContent(id);
    });
  });
});

//-------dont repeat breadcrumb-----
document.addEventListener('DOMContentLoaded', function () {
  const breadcrumbContainer = document.querySelector('.breadcrumb')
  if (!breadcrumbContainer) return

  const items = breadcrumbContainer.querySelectorAll('li')
  if (!items || items.length === 0) return

  const uniqueLinks = new Map()

  items.forEach((li) => {
    if (!li) return

    const link = li.querySelector('a')
    if (!link) return

    const text = link.textContent.trim()
    if (!text) return

    if (!uniqueLinks.has(text)) {
      uniqueLinks.set(text, li)
    } else {
      li.remove()
    }
  })
})

//--------------POV-form-------------//
document.querySelectorAll('.pov-form').forEach(function (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault()

    const loading = form.closest('form').querySelector('.Loading_Form')
    const message = form.closest('form').querySelector('.Message-Form')

    loading.classList.remove('hidden')

    const formData = new FormData(form)

    fetch(form.getAttribute('action'), {
      method: form.getAttribute('method'),
      body: formData,
    })
      .then((response) =>
        response.text().then((text) => ({ text, ok: response.ok }))
      )
      .then(({ text, ok }) => {
        loading.classList.add('hidden')
        message.innerHTML = text

        if (ok) {
          message.style.color = 'green'
        } else {
          message.style.color = 'red'
        }

        form.querySelectorAll('textarea, input').forEach((el) => (el.value = ''))
      })
      .catch(() => {
        loading.classList.add('hidden')
        message.innerHTML = 'An error occurred. Please try again.'
        message.style.color = 'red'
      })
  })
})

// refresh_captch
function refresh_captcha(element, event) {
  const form = element.closest("form");
  const captchaContainer = form.querySelector(".load-captcha");

  fetch("/Client_Captcha.bc?lid=1")
    .then((response) => response.text())
    .then((data) => {
      captchaContainer.innerHTML = data;
    });
}

//---------paging order-----
function setupPaging(currentPageOverride) {

  const paging = document.querySelector("#wibpaging");
  if (!paging) {
    console.warn("[paging] #wibpaging NOT FOUND in DOM");
    return;
  }

  [...paging.querySelectorAll("li")].forEach(li => {
    if (li.textContent.trim() === "…") li.remove();
  });

  const pageItems = [...paging.querySelectorAll("li")].filter(li => {
    if (li.classList.contains("prev-page")) return false;
    if (li.classList.contains("next-page")) return false;

    const num = parseInt(li.textContent.trim(), 10);
    return !isNaN(num);
  });

  if (pageItems.length === 0) {
    console.warn("[paging] NO numbered <li> found, EXITING");
    return;
  }

  let currentPage;
  if (typeof currentPageOverride === "number") {
    currentPage = currentPageOverride;
  } else {
    const activeLi =
      paging.querySelector("li.active") ||
      paging.querySelector("li[aria-current='page']");
    if (activeLi) {
      currentPage = parseInt(activeLi.textContent.trim(), 10);
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      currentPage = parseInt(urlParams.get("pagenum") || "1", 10);
    }
  }

  const pageNumbers = pageItems.map(li =>
    parseInt(li.textContent.trim(), 10)
  );

  const minPage = Math.min(...pageNumbers);
  const maxPage = Math.max(...pageNumbers);


  const createDots = () => {
    const li = document.createElement("li");
    li.textContent = "…";
    li.className = "flex items-center justify-center font-bold text-zinc-700";
    return li;
  };

  const getLiList = () => [...paging.querySelectorAll("li")];

  const prevLi = getLiList().find(li => li.classList.contains("prev-page"));
  const nextLi = getLiList().find(li => li.classList.contains("next-page"));

  let firstPageLi = pageItems.find(
    li => li.textContent.trim() === String(minPage)
  );
  let lastPageLi = pageItems.find(
    li => li.textContent.trim() === String(maxPage)
  );

  if (firstPageLi && prevLi && prevLi.nextElementSibling !== firstPageLi) {
    paging.insertBefore(firstPageLi, prevLi.nextElementSibling);
  }

  if (lastPageLi && nextLi && lastPageLi.nextElementSibling !== nextLi) {
    paging.insertBefore(lastPageLi, nextLi);
  }

  firstPageLi = pageItems.find(
    li => li.textContent.trim() === String(minPage)
  );
  lastPageLi = pageItems.find(
    li => li.textContent.trim() === String(maxPage)
  );

  if (currentPage - minPage > 2 && firstPageLi) {
    const afterFirst = firstPageLi.nextElementSibling;
    if (afterFirst && afterFirst.textContent.trim() !== "…") {
      paging.insertBefore(createDots(), afterFirst);
    }
  }

  if (maxPage - currentPage > 2 && lastPageLi) {
    const beforeLast = lastPageLi.previousElementSibling;
    if (beforeLast && beforeLast.textContent.trim() !== "…") {
      paging.insertBefore(createDots(), lastPageLi);
    }
  }

  paging.addEventListener(
    "click",
    function (e) {
      const li = e.target.closest("li");
      if (!li) return;

      if (li.classList.contains("prev-page")) {
        return;
      }
      if (li.classList.contains("next-page")) {
        return;
      }

      const num = parseInt(li.textContent.trim(), 10);
      if (isNaN(num)) {
        return;
      }

      if (typeof fetchArticlePage === "function") {
        fetchArticlePage(num);
      } else {
        console.warn(
          "[paging] fetchArticlePage is not a function:",
          typeof fetchArticlePage
        );
      }
    },
    { once: true }
  );
}


document.addEventListener("DOMContentLoaded", function () {
  setupPaging();
});

// footer-form
function uploadDocumentFooter(args) {
  document.querySelector("#footer-form-resize .Loading_Form").style.display = "block";
  const captcha = document
    .querySelector("#footer-form-resize")
    .querySelector("#captchaContainer input[name='captcha']").value;
  const captchaid = document
    .querySelector("#footer-form-resize")
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
    document.querySelector("#footer-form-resize .Loading_Form").style.display = "none";
    document.querySelector("#footer-form-resize .message-api").innerHTML =
      "Your request has been successfully submitted.";
    document.querySelector("#footer-form-resize .message-api").style.color =
      "rgb(10 240 10)";
  } else {
    refreshCaptchaFooter();
    setTimeout(() => {
      document.querySelector("#footer-form-resize .Loading_Form").style.display =
        "none";
      document.querySelector("#footer-form-resize .message-api").innerHTML =
        "An error occurred, please try again.";
      document.querySelector("#footer-form-resize .message-api").style.color =
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

// about-form
function uploadDocumentAbout(args) {
  document.querySelector("#about-form-resize .Loading_Form").style.display = "block";
  const captcha = document
    .querySelector("#about-form-resize")
    .querySelector("#captchaContainer input[name='captcha']").value;
  const captchaid = document
    .querySelector("#about-form-resize")
    .querySelector("#captchaContainer input[name='captchaid']").value;
  const stringJson = JSON.stringify(args.source?.rows[0]);
  $bc.setSource("cms.uploadAbout", {
    value: stringJson,
    captcha: captcha,
    captchaid: captchaid,
    run: true,
  });
}

function refreshCaptchaAbout(e) {
  $bc.setSource("captcha.refreshAbout", true);
}

async function OnProcessedEditObjectAbout(args) {
  var response = args.response;
  var json = await response.json();
  var errorid = json.errorid;
  if (errorid == "6") {
    document.querySelector("#about-form-resize .Loading_Form").style.display = "none";
    document.querySelector("#about-form-resize .message-api").innerHTML =
      "Your request has been successfully submitted.";
    document.querySelector("#about-form-resize .message-api").style.color =
      "rgb(10 240 10)";
  } else {
    refreshCaptchaAbout();
    setTimeout(() => {
      document.querySelector("#about-form-resize .Loading_Form").style.display =
        "none";
      document.querySelector("#about-form-resize .message-api").innerHTML =
        "An error occurred, please try again.";
      document.querySelector("#about-form-resize .message-api").style.color =
        "rgb(220 38 38)";
    }, 2000);
  }
}

async function RenderFormAbout() {
  var inputElementVisa7 = document.querySelector(
    " .contact-company-name input[data-bc-text-input]"
  );
  inputElementVisa7.setAttribute("placeholder", "Company Name");
  var inputElementVisa7 = document.querySelector(
    " .contact-number-phone input[data-bc-text-input]"
  );
  inputElementVisa7.setAttribute("placeholder", "Number Phone");
  var inputElementVisa7 = document.querySelector(
    " .contact-address input[data-bc-text-input]"
  );
  inputElementVisa7.setAttribute("placeholder", "Address");
  var inputElementVisa7 = document.querySelector(
    " .contact-phone input[data-bc-text-input]"
  );
  inputElementVisa7.setAttribute("placeholder", "Phone");
}

if (document.querySelector('.swiper-comment')) {
var swiperComment = new Swiper(".swiper-comment", {
    slidesPerView: 1.3,
    speed: 400,
    centeredSlides: false,
    spaceBetween: 24,
    grabCursor: true,
    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
    },
    loop: true,
    breakpoints: {
        1024: {
            slidesPerView: 4,
            spaceBetween: 24,
        },
    },
});
}
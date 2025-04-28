// 移动端侧栏
const sidebarFn = () => {
    const $toggleMenu = document.getElementById('toggle-menu');
    const $mobileSidebarMenus = document.getElementById('sidebar-menus');
    const $menuMask = document.getElementById('menu-mask');
    const $body = document.body;
    const toggleMobileSidebar = (isOpen) => {
        utils.sidebarPaddingR();
        $body.style.overflow = isOpen ? 'hidden' : '';
        $body.style.paddingRight = isOpen ? '' : '';
        utils[isOpen ? 'fadeIn' : 'fadeOut']($menuMask, 0.5);
        $mobileSidebarMenus.classList[isOpen ? 'add' : 'remove']('open');
    }
    $toggleMenu.addEventListener('click', () => toggleMobileSidebar(true));
    $menuMask.addEventListener('click', () => {
        if ($mobileSidebarMenus.classList.contains('open')) {
            toggleMobileSidebar(false);
        }
    });
    window.addEventListener('resize', () => {
        if (utils.isHidden($toggleMenu) && $mobileSidebarMenus.classList.contains('open')) {
            toggleMobileSidebar(false);
        }
        flec.refreshWaterFall();
    });
}

// 滚动事件监听
const scrollFn = function () {
    const innerHeight = window.innerHeight;
    if (document.body.scrollHeight <= innerHeight) return;
    let initTop = 0;
    const $header = document.getElementById('page-header');
    const throttledScroll = utils.throttle(function (e) {
        initThemeColor();
        const currentTop = window.scrollY || document.documentElement.scrollTop;
        const isDown = scrollDirection(currentTop);
        if (currentTop > 0) {
            if (isDown) {
                if ($header.classList.contains('nav-visible')) $header.classList.remove('nav-visible');
            } else {
                if (!$header.classList.contains('nav-visible')) $header.classList.add('nav-visible');
            }
            $header.classList.add('nav-fixed');
        } else {
            $header.classList.remove('nav-fixed', 'nav-visible');
        }
    }, 200);
    window.addEventListener('scroll', function (e) {
        throttledScroll(e);
        if (window.scrollY === 0) {
            $header.classList.remove('nav-fixed', 'nav-visible');
        }
    });

    function scrollDirection(currentTop) {
        const result = currentTop > initTop;
        initTop = currentTop;
        return result;
    }
}

// 进度球
const percent = () => {
    const docEl = document.documentElement;
    const body = document.body;
    const scrollPos = window.pageYOffset || docEl.scrollTop;
    const totalScrollableHeight = Math.max(body.scrollHeight, docEl.scrollHeight, body.offsetHeight, docEl.offsetHeight, body.clientHeight, docEl.clientHeight) - docEl.clientHeight;
    const scrolledPercent = Math.round((scrollPos / totalScrollableHeight) * 100);
    const navToTop = document.querySelector("#nav-totop");
    const percentDisplay = document.querySelector("#percent");
    const isNearEnd = (window.scrollY + docEl.clientHeight) >= (document.getElementById("post-comment") || document.getElementById("footer")).offsetTop;
    navToTop.classList.toggle("long", isNearEnd || scrolledPercent > 90);
    percentDisplay.textContent = isNearEnd || scrolledPercent > 90 ? GLOBAL_CONFIG.lang.backtop : scrolledPercent;
    document.querySelectorAll(".needEndHide").forEach(item => item.classList.toggle("hide", totalScrollableHeight - scrollPos < 100));
}

// 展示今日卡片
const showTodayCard = () => {
    const el = document.getElementById('todayCard');
    const topGroup = document.querySelector('.topGroup');
    topGroup?.addEventListener('mouseleave', () => el?.classList.remove('hide'));
}

// 初始化 IntersectionObserver
const initObserver = () => {
    const commentElement = document.getElementById("post-comment");
    const paginationElement = document.getElementById("pagination");
    const commentBarrageElement = document.querySelector(".comment-barrage");
    if (commentElement && paginationElement) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                const action = entry.isIntersecting ? 'add' : 'remove';
                paginationElement.classList[action]("show-window");
                if (GLOBAL_CONFIG.comment.commentBarrage) {
                    commentBarrageElement.style.bottom = entry.isIntersecting ? "-200px" : "0px";
                }
            });
        });
        observer.observe(commentElement);
    }
};

// 复制版权信息
const addCopyright = () => {
    if (!GLOBAL_CONFIG.copyright) return;
    const {limit, author, link, source, info} = GLOBAL_CONFIG.copyright;
    document.body.addEventListener('copy', (e) => {
        e.preventDefault();
        const copyText = window.getSelection().toString();
        const text = copyText.length > limit ? `${copyText}\n\n${author}\n${link}${window.location.href}\n${source}\n${info}` : copyText;
        e.clipboardData.setData('text', text);
    });
};

// 侧边栏状态
const asideStatus = () => {
    const status = utils.saveToLocal.get('aside-status');
    document.documentElement.classList.toggle('hide-aside', status === 'hide');
}

// 初始化主题色
function initThemeColor() {
    const currentTop = window.scrollY || document.documentElement.scrollTop;
    const themeColor = currentTop > 0 ? '--flec-card-bg' : PAGE_CONFIG.is_post ? '--flec-main' : '--flec-background';
    applyThemeColor(getComputedStyle(document.documentElement).getPropertyValue(themeColor));
}

/**
 * applyThemeColor
 * @description 应用主题色
 * @param color
 */
function applyThemeColor(color) {
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    const appleMobileWebAppMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    themeColorMeta?.setAttribute("content", color);
    appleMobileWebAppMeta?.setAttribute("content", color);
    if (window.matchMedia("(display-mode: standalone)").matches) {
        document.body.style.backgroundColor = color;
    }
}

/**
 * handleThemeChange
 * @description 切换主题色
 * @param mode
 */
const handleThemeChange = mode => {
    const themeChange = window.globalFn?.themeChange || {}
    for (let key in themeChange) {
        themeChange[key](mode)
    }
}

// lastSayHello 上次打招呼的内容
let lastSayHello = "";
// 用于记录标签页是否被隐藏，从而改变下次执行打招呼的内容
let wasPageHidden = false;
// musicPlaying 是否正在播放音乐
let musicPlaying = false
// is_rm 是否启用右键菜单
let is_rm = typeof rm !== 'undefined'

/**
 * flec
 * @description FlecUI 主题的一些方法
 * @type {{showConsole: (function(): boolean), setTimeState: flec.setTimeState, toTop: (function(): void), changeTimeFormat(*): void, hideCookie: flec.hideCookie, owoBig(*): void, switchDarkMode: flec.switchDarkMode, openAllTags: flec.openAllTags, switchHideAside: flec.switchHideAside, addRuntime: flec.addRuntime, refreshWaterFall: flec.refreshWaterFall, categoriesBarActive: flec.categoriesBarActive, addNavBackgroundInit: flec.addNavBackgroundInit, toPage: flec.toPage, changeSayHelloText: flec.changeSayHelloText, initConsoleState: (function(): void), switchComments(): void, switchKeyboard: flec.switchKeyboard, listenToPageInputPress: flec.listenToPageInputPress, scrollTo: flec.scrollTo, musicToggle: flec.musicToggle, toTalk: flec.toTalk, switchCommentBarrage: flec.switchCommentBarrage, hideTodayCard: (function(): void), scrollCategoryBarToRight: flec.scrollCategoryBarToRight, scrollToComment: flec.scrollToComment, initbbtalk: flec.initbbtalk, tagPageActive: flec.tagPageActive, hideConsole: (function(): void), addPhotoFigcaption: flec.addPhotoFigcaption}}
 */
let flec = {
    /**
     * hideCookie
     * @description 隐藏 cookie 通知
     */
    hideCookie: function () {
        const cookiesWindow = document.getElementById("cookies-window");
        if (cookiesWindow) {
            setTimeout(() => {
                cookiesWindow.classList.add("cw-hide");
                setTimeout(() => cookiesWindow.style.display = "none", 1000);
            }, 3000);
        }
    },
    /**
     * scrollTo
     * @description 滚动到指定元素
     * @param elementId
     */
    scrollTo: function (elementId) {
        const targetElement = document.getElementById(elementId);
        if (targetElement) {
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scroll({
                top: targetPosition,
                behavior: "smooth"
            });
        }
    },
    /**
     * musicToggle
     * @description 音乐播放开关
     */
    musicToggle: function () {
        const $music = document.querySelector('#nav-music');
        const $meting = document.querySelector('meting-js');
        const $rm_text = document.querySelector('#menu-music-toggle span');
        const $rm_icon = document.querySelector('#menu-music-toggle i');
        musicPlaying = !musicPlaying;
        $music.classList.toggle("playing", musicPlaying);
        if (musicPlaying) {
            $meting.aplayer.play();
            rm?.menuItems.music[0] && ($rm_text.textContent = GLOBAL_CONFIG.right_menu.music.stop) && ($rm_icon.className = 'flecicon flec-pause-fill')
        } else {
            $meting.aplayer.pause();
            rm?.menuItems.music[0] && ($rm_text.textContent = GLOBAL_CONFIG.right_menu.music.start) && ($rm_icon.className = 'flecicon flec-play-fill')
        }
    },
    /**
     * switchCommentBarrage
     * @description 切换评论弹幕
     */
    switchCommentBarrage: function () {
        let commentBarrageElement = document.querySelector(".comment-barrage");
        if (!commentBarrageElement) return;
        const isDisplayed = window.getComputedStyle(commentBarrageElement).display === "flex";
        commentBarrageElement.style.display = isDisplayed ? "none" : "flex";
        document.querySelector("#consoleCommentBarrage").classList.toggle("on", !isDisplayed);
        utils.saveToLocal.set("commentBarrageSwitch", !isDisplayed, .2);
        rm?.menuItems.barrage && rm.barrage(isDisplayed)
    },
    /**
     * switchHideAside
     * @description 切换侧边栏
     */
    switchHideAside: function () {
        const htmlClassList = document.documentElement.classList;
        const consoleHideAside = document.querySelector("#consoleHideAside");
        const isHideAside = htmlClassList.contains("hide-aside");
        utils.saveToLocal.set("aside-status", isHideAside ? "show" : "hide", 1);
        htmlClassList.toggle("hide-aside");
        consoleHideAside.classList.toggle("on", !isHideAside);
    },
    /**
     * switchKeyboard
     * @description 切换快捷键
     */
    switchKeyboard: function () {
        flec_keyboards = !flec_keyboards;
        const consoleKeyboard = document.querySelector("#consoleKeyboard");
        const keyboardFunction = flec_keyboards ? openKeyboard : closeKeyboard;
        consoleKeyboard.classList.toggle("on", flec_keyboards);
        keyboardFunction();
        localStorage.setItem("keyboard", flec_keyboards);
        document.getElementById('keyboard-tips')?.classList.remove('show');
    },
    /**
     * initConsoleState
     * @description 初始化控制台状态
     */
    initConsoleState: () => document.documentElement.classList.contains("hide-aside") ? document.querySelector("#consoleHideAside").classList.add("on") : document.querySelector("#consoleHideAside").classList.remove("on"),
    /**
     * changeSayHelloText
     * @description 更改打招呼文本
     */
    changeSayHelloText: function () {
        const greetings = GLOBAL_CONFIG.aside.sayhello2;
        const greetingElement = document.getElementById("author-info__sayhi");
        let randomGreeting;
        do {
            randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
        } while (randomGreeting === lastSayHello);
        greetingElement.textContent = randomGreeting;
        lastSayHello = randomGreeting;
    },
    /**
     * switchDarkMode
     * @description 切换显示模式
     */
    switchDarkMode: function () {
        const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
        const newMode = isDarkMode ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newMode);
        utils.saveToLocal.set('theme', newMode, 0.02);
        utils.snackbarShow(GLOBAL_CONFIG.lang.theme[newMode], false, 2000);
        if (is_rm) rm.mode(!isDarkMode);
        handleThemeChange(newMode);
    },
    /**
     * hideTodayCard
     * @description 隐藏今日卡片
     */
    hideTodayCard: () => document.getElementById('todayCard').classList.add('hide'),
    /**
     * toTop
     * @description 返回顶部
     */
    toTop: () => utils.scrollToDest(0),
    /**
     * showConsole
     * @description 显示控制台
     */
    showConsole: () => document.getElementById('console')?.classList.toggle('show', true),
    /**
     * hideConsole
     * @description 隐藏控制台
     */
    hideConsole: () => document.getElementById('console')?.classList.remove('show'),
    /**
     * refreshWaterFall
     * @description 刷新瀑布流
     */
    refreshWaterFall: function () {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        waterfall(entry.target) || entry.target.classList.add('show');
                    }, 300);
                }
            });
        });
        document.querySelectorAll('.waterfall').forEach(el => observer.observe(el));
    },
    /**
     * addRuntime
     * @description 添加运行时间
     */
    addRuntime: function () {
        let el = document.getElementById('runtimeshow')
        el && GLOBAL_CONFIG.runtime && (el.innerText = utils.timeDiff(new Date(GLOBAL_CONFIG.runtime), new Date()) + GLOBAL_CONFIG.lang.time.day)
    },
    /**
     * toTalk
     * @description 回复评论
     * @param txt
     */
    toTalk: function (txt) {
        const inputs = ["#wl-edit", ".el-textarea__inner", "#veditor", ".atk-textarea"];
        inputs.forEach(selector => {
            const el = document.querySelector(selector);
            if (el) {
                el.dispatchEvent(new Event('input', {bubble: true, cancelable: true}));
                el.value = '> ' + txt.replace(/\n/g, '\n> ') + '\n\n';
                utils.scrollToDest(utils.getEleTop(document.getElementById('post-comment')), 300);
                el.focus();
                el.setSelectionRange(-1, -1);
            }
        });
        utils.snackbarShow(GLOBAL_CONFIG.lang.totalk, false, 2000);
    },
    /**
     * initbbtalk
     * @description 初始化 bbtalk
     */
    initbbtalk: function () {
        const bberTalkElement = document.querySelector('#bber-talk');
        if (bberTalkElement) {
            new Swiper('.swiper-container', {
                direction: 'vertical',
                loop: true,
                autoplay: {
                    delay: 3000,
                    pauseOnMouseEnter: true
                },
            });
        }
    },
    /**
     * addPhotoFigcaption
     * @description 添加图片标题
     */
    addPhotoFigcaption: function () {
        document.querySelectorAll('#article-container img:not(.gallery-item img)').forEach(image => {
            const captionText = image.getAttribute('alt');
            captionText && image.insertAdjacentHTML('afterend', `<div style="display:none;">${captionText}</div>`);
        });
    },
    /**
     * scrollToComment
     * @description 滚动到评论
     */
    scrollToComment: function () {
        utils.scrollToDest(utils.getEleTop(document.getElementById('post-comment')), 300)
    },
    /**
     * setTimeState
     * @description 设置时间状态
     */
    setTimeState: function () {
        const el = document.getElementById('author-info__sayhi');
        if (el) {
            const hours = new Date().getHours();
            const lang = GLOBAL_CONFIG.aside.sayhello;

            const localData = getLocalData(['twikoo', 'WALINE_USER_META', 'WALINE_USER', '_v_Cache_Meta', 'ArtalkUser']);

            function getLocalData(keys) {
                for (let key of keys) {
                    const data = localStorage.getItem(key);
                    if (data) {
                        console.log(key, data);
                        return JSON.parse(data);
                    }
                }
                return null;
            };
            const nick = localData ? (localData.nick ? localData.nick : localData.display_name) : null;

            let prefix;
            if (wasPageHidden) {
                prefix = GLOBAL_CONFIG.aside.sayhello3.back + nick;
                wasPageHidden = false;
            } else {
                prefix = GLOBAL_CONFIG.aside.sayhello3.prefix + nick;
            }

            const greetings = [
                {start: 0, end: 5, text: nick ? prefix : lang.goodnight},
                {start: 6, end: 10, text: nick ? prefix : lang.morning},
                {start: 11, end: 14, text: nick ? prefix : lang.noon},
                {start: 15, end: 18, text: nick ? prefix : lang.afternoon},
                {start: 19, end: 24, text: nick ? prefix : lang.night},
            ];
            const greeting = greetings.find(g => hours >= g.start && hours <= g.end);
            el.innerText = greeting.text;
        }
    },
    /**
     * tagPageActive
     * @description 标签页当前标签高亮
     */
    tagPageActive: function () {
        const decodedPath = decodeURIComponent(window.location.pathname);
        const isTagPage = /\/tags\/.*?\//.test(decodedPath);
        if (isTagPage) {
            const tag = decodedPath.split("/").slice(-2, -1)[0];
            const tagElement = document.getElementById(tag);
            if (tagElement) {
                document.querySelectorAll("a.select").forEach(link => {
                    link.classList.remove("select");
                });
                tagElement.classList.add("select");
            }
        }
    },
    /**
     * categoriesBarActive
     * @description 分类栏当前分类高亮
     */
    categoriesBarActive: function () {
        const categoryBar = document.querySelector("#category-bar");
        const currentPath = decodeURIComponent(window.location.pathname);
        const isHomePage = currentPath === "/";
        if (categoryBar) {
            const categoryItems = categoryBar.querySelectorAll(".category-bar-item");
            categoryItems.forEach(item => item.classList.remove("select"));
            const activeItemId = isHomePage ? "category-bar-home" : currentPath.split("/").slice(-2, -1)[0];
            const activeItem = document.getElementById(activeItemId);
            if (activeItem) {
                activeItem.classList.add("select");
            }
        }
    },
    /**
     * scrollCategoryBarToRight
     * @description 滚动分类栏到右侧
     */
    scrollCategoryBarToRight: function () {
        const scrollBar = document.getElementById("category-bar-items");
        const nextElement = document.getElementById("category-bar-next");
        if (scrollBar) {
            const isScrollBarAtEnd = () => scrollBar.scrollLeft + scrollBar.clientWidth >= scrollBar.scrollWidth - 8;
            const scroll = () => {
                if (isScrollBarAtEnd()) {
                    scrollBar.scroll({left: 0, behavior: "smooth"});
                } else {
                    scrollBar.scrollBy({left: scrollBar.clientWidth, behavior: "smooth"});
                }
            };
            scrollBar.addEventListener("scroll", () => {
                clearTimeout(this.timeoutId);
                this.timeoutId = setTimeout(() => {
                    nextElement.style.transform = isScrollBarAtEnd() ? "rotate(180deg)" : "";
                }, 150);
            });
            scroll();
        }
    },
    /**
     * openAllTags
     * @description 展开所有标签
     */
    openAllTags: () => {
        document.querySelectorAll(".card-allinfo .card-tag-cloud").forEach(tagCloudElement => tagCloudElement.classList.add("all-tags"));
        document.getElementById("more-tags-btn")?.remove();
    },
    /**
     * listenToPageInputPress
     * @description 监听页码输入
     */
    listenToPageInputPress: function () {
        const toGroup = document.querySelector(".toPageGroup")
        const pageText = document.getElementById("toPageText");
        if (!pageText) return;
        const pageButton = document.getElementById("toPageButton");
        const pageNumbers = document.querySelectorAll(".page-number");
        const lastPageNumber = +pageNumbers[pageNumbers.length - 1].textContent;
        if (!pageText || lastPageNumber === 1) {
            toGroup.style.display = "none";
            return
        }
        pageText.addEventListener("keydown", (event) => {
            if (event.keyCode === 13) {
                flec.toPage();
                pjax.loadUrl(pageButton.href);
            }
        });
        pageText.addEventListener("input", () => {
            pageButton.classList.toggle("haveValue", pageText.value !== "" && pageText.value !== "0");
            if (+pageText.value > lastPageNumber) {
                pageText.value = lastPageNumber;
            }
        });
    },
    /**
     * addNavBackgroundInit
     * @description 添加导航背景初始化
     */
    addNavBackgroundInit: function () {
        const scrollTop = document.documentElement.scrollTop;
        (scrollTop !== 0) && document.getElementById("page-header").classList.add("nav-fixed", "nav-visible");
    },
    /**
     * toPage
     * @description 跳转到指定页
     */
    toPage: function () {
        const pageNumbers = document.querySelectorAll(".page-number");
        const maxPageNumber = parseInt(pageNumbers[pageNumbers.length - 1].innerHTML);
        const inputElement = document.getElementById("toPageText");
        const inputPageNumber = parseInt(inputElement.value);
        document.getElementById("toPageButton").href = (!isNaN(inputPageNumber) && inputPageNumber <= maxPageNumber && inputPageNumber > 1)
            ? window.location.href.replace(/\/page\/\d+\/$/, "/") + "page/" + inputPageNumber + "/"
            : '/';
    },
    /**
     * owobig
     * @description owo 大图
     * @param owoSelector
     */
    owoBig(owoSelector) {
        let owoBig = document.getElementById('owo-big');
        if (!owoBig) {
            owoBig = document.createElement('div');
            owoBig.id = 'owo-big';
            document.body.appendChild(owoBig);
        }
        const showOwoBig = event => {
            const target = event.target;
            const owoItem = target.closest(owoSelector.item);
            if (owoItem && target.closest(owoSelector.body)) {
                const imgSrc = owoItem.querySelector('img')?.src;
                if (imgSrc) {
                    owoBig.innerHTML = `<img src="${imgSrc}" style="max-width: 100%; height: auto;">`;
                    owoBig.style.display = 'block';
                    positionOwoBig(owoItem);
                }
            }
        };
        const hideOwoBig = event => {
            if (event.target.closest(owoSelector.item) && event.target.closest(owoSelector.body)) {
                owoBig.style.display = 'none';
            }
        };
        const positionOwoBig = owoItem => {
            const itemRect = owoItem.getBoundingClientRect();
            owoBig.style.left = `${itemRect.left - (owoBig.offsetWidth / 4)}px`;
            owoBig.style.top = `${itemRect.top}px`;
        }
        document.addEventListener('mouseover', showOwoBig);
        document.addEventListener('mouseout', hideOwoBig);
    },
    /**
     * changeTimeFormat
     * @description 更改时间格式
     * @param selector
     */
    changeTimeFormat(selector) {
        selector.forEach(item => {
            const timeVal = item.getAttribute('datetime')
            item.textContent = utils.diffDate(timeVal, true)
            item.style.display = 'inline'
        })
    },
    /**
     * switchComments
     * @description 切换评论
     */
    switchComments() {
        const switchBtn = document.getElementById('switch-btn')
        if (!switchBtn) return
        let switchDone = false
        const commentContainer = document.getElementById('post-comment')
        const handleSwitchBtn = () => {
            commentContainer.classList.toggle('move')
            if (!switchDone && typeof loadTwoComment === 'function') {
                switchDone = true
                loadTwoComment()
            }
        }
        utils.addEventListenerPjax(switchBtn, 'click', handleSwitchBtn)
    },
    photos(tag) {
        let url = 'https://memos.talen.top' // 修改api
        let currentPath = window.location.pathname;
        let tag_category = currentPath === '/photos/' ? '相册' : '影集';
        let apiUrl = tag ? `${url}/api/v1/memo?creatorId=1&tag=${tag}` : `${url}/api/v1/memo?creatorId=1&tag=${tag_category}`;
        fetch(apiUrl).then(res => res.json()).then(data => {
            let html = '',
                imgs = []
            data.forEach(item => {
                let ls = item.content.match(/\!\[.*?\]\(.*?\)/g)
                if (ls) imgs = imgs.concat(ls)
                if (item.resourceList.length) {
                    item.resourceList.forEach(t => {
                        if (t.externalLink) imgs.push(`![](${t.externalLink})`)
                        else imgs.push(`![](${url}/o/r/${t.id}/${t.publicId}/${t.filename})`)
                    })
                }
            })

            if (imgs) imgs.forEach(item => {
                let img = item.replace(/!\[.*?\]\((.*?)\)/g, '$1'),
                    time, title, tat = item.replace(/!\[(.*?)\]\(.*?\)/g, '$1')
                if (tat.indexOf(' ') != -1) {
                    time = tat.split(' ')[0]
                    title = tat.split(' ')[1]
                } else title = tat

                html += `<div class="gallery-photo"><a href="${img}" data-fancybox="gallery" class="fancybox" data-thumb="${img}"><img class="no-lazyload photo-img" loading='lazy' decoding="async" src="${img}"></a>`
                title ? html += `<span class="photo-title">${title}</span>` : ''
                time ? html += `<span class="photo-time">${time}</span>` : ''
                html += `</div>`
            })

            document.querySelector('.gallery-photos.page').innerHTML = html
            imgStatus.watch('.photo-img', () => { waterfall('.gallery-photos') })
            window.Lately && Lately.init({ target: '.photo-time' })
        }).catch()

        var statusBarItemItems = document.querySelectorAll('.status-bar-item');
        let firstElement = statusBarItemItems[0]; // Bar栏首次进入的按钮状态
        firstElement.classList.add('selected');

        Array.from(statusBarItemItems).forEach(function (element) {
            element.onclick = function (event) {
                var selectedElements = document.querySelectorAll('.status-bar-item.selected');
                Array.from(selectedElements).forEach(function (selectedElement) {
                    selectedElement.classList.remove('selected');
                });
                element.classList.add('selected');

                event.stopPropagation();
                event.preventDefault();
                return false;
            };
        });
    },
    statusbar(elementId) {
        const container = document.getElementById(elementId);

        if (container) {
          const buttonId = (elementId === "category-bar-items") ? "category-bar-button" : "status-bar-button";
          const button = document.getElementById(buttonId);
          const maxScroll = container.scrollWidth - container.clientWidth;

          if (container.scrollLeft + container.clientWidth >= maxScroll - 8) {
            container.scrollTo({
              left: 0,
              behavior: "smooth"
            });
          } else {
            container.scrollBy({
              left: container.clientWidth,
              behavior: "smooth"
            });
          }
      
          container.addEventListener("scroll", function() {
            button.style.transform = (container.scrollLeft + container.clientWidth >= maxScroll - 8) ? "rotate(180deg)" : "";
          }, { once: true });
        }
    }
}

/**
 * addHighlight
 * @description 添加代码高亮
 */
const addHighlight = () => {
    const highlight = GLOBAL_CONFIG.highlight;
    if (!highlight) return;
    const {copy, expand, limit, syntax} = highlight;
    const $isPrismjs = syntax === 'prismjs';
    const $isShowTool = highlight.enable || copy || expand || limit;
    const expandClass = !expand === true ? 'closed' : ''
    const $syntaxHighlight = syntax === 'highlight.js' ? document.querySelectorAll('figure.highlight') : document.querySelectorAll('pre[class*="language-"]')
    if (!(($isShowTool || limit) && $syntaxHighlight.length)) return
    const copyEle = copy ? `<i class="flecicon flec-copy-fill copy-button"></i>` : '<i></i>';
    const expandEle = `<i class="flecicon flec-down-one-arrow-line expand"></i>`;
    const limitEle = limit ? `<i class="flecicon flec-slideshow-line"></i>` : '<i></i>';
    const alertInfo = (ele, text) => utils.snackbarShow(text, false, 2000)
    const copyFn = (e) => {
        const $buttonParent = e.parentNode
        $buttonParent.classList.add('copy-true')
        const selection = window.getSelection()
        const range = document.createRange()
        const preCodeSelector = $isPrismjs ? 'pre code' : 'table .code pre'
        range.selectNodeContents($buttonParent.querySelectorAll(`${preCodeSelector}`)[0])
        selection.removeAllRanges()
        selection.addRange(range)
        document.execCommand('copy')
        alertInfo(e.lastChild, GLOBAL_CONFIG.lang.copy.success)
        selection.removeAllRanges()
        $buttonParent.classList.remove('copy-true')
    }
    const expandClose = (e) => e.classList.toggle('closed')
    const shrinkEle = function () {
        this.classList.toggle('expand-done')
    }
    const ToolsFn = function (e) {
        const $target = e.target.classList
        if ($target.contains('expand')) expandClose(this)
        else if ($target.contains('copy-button')) copyFn(this)
    }
    const createEle = (lang, item, service) => {
        const fragment = document.createDocumentFragment()
        if ($isShowTool) {
            const hlTools = document.createElement('div')
            hlTools.className = `highlight-tools ${expandClass}`
            hlTools.innerHTML = expandEle + lang + copyEle
            utils.addEventListenerPjax(hlTools, 'click', ToolsFn)
            fragment.appendChild(hlTools)
        }
        if (limit && item.offsetHeight > limit + 30) {
            const ele = document.createElement('div')
            ele.className = 'code-expand-btn'
            ele.innerHTML = limitEle
            utils.addEventListenerPjax(ele, 'click', shrinkEle)
            fragment.appendChild(ele)
        }
        if (service === 'hl') {
            item.insertBefore(fragment, item.firstChild)
        } else {
            item.parentNode.insertBefore(fragment, item)
        }
    }
    if ($isPrismjs) {
        $syntaxHighlight.forEach(item => {
            const langName = item.getAttribute('data-language') || 'Code'
            const highlightLangEle = `<div class="code-lang">${langName}</div>`
            utils.wrap(item, 'figure', {
                class: 'highlight'
            })
            createEle(highlightLangEle, item)
        })
    } else {
        $syntaxHighlight.forEach(item => {
            let langName = item.getAttribute('class').split(' ')[1]
            if (langName === 'plain' || langName === undefined) langName = 'Code'
            const highlightLangEle = `<div class="code-lang">${langName}</div>`
            createEle(highlightLangEle, item, 'hl')
        })
    }
}

/**
 * toc
 * @description 目录
 */
class toc {
    static init() {
        const tocContainer = document.getElementById('card-toc')
        if (!tocContainer || !tocContainer.querySelector('.toc a')) {
            tocContainer.style.display = 'none'
            return
        }
        const el = document.querySelectorAll('.toc a')
        el.forEach((e) => {
            e.addEventListener('click', (event) => {
                event.preventDefault()
                utils.scrollToDest(utils.getEleTop(document.getElementById(decodeURI((event.target.className === 'toc-text' ? event.target.parentNode.hash : event.target.hash).replace('#', '')))), 300)
            })
        })
        this.active(el)
    }

    static active(toc) {
        const $article = document.getElementById('article-container')
        const $tocContent = document.getElementById('toc-content')
        const list = $article.querySelectorAll('h1,h2,h3,h4,h5,h6')
        let detectItem = ''

        function autoScroll(el) {
            const activePosition = el.getBoundingClientRect().top
            const sidebarScrollTop = $tocContent.scrollTop
            if (activePosition > (document.documentElement.clientHeight - 100)) {
                $tocContent.scrollTop = sidebarScrollTop + 150
            }
            if (activePosition < 100) {
                $tocContent.scrollTop = sidebarScrollTop - 150
            }
        }

        function findHeadPosition(top) {
            if (top === 0) return false
            let currentIndex = ''
            list.forEach(function (ele, index) {
                if (top > utils.getEleTop(ele) - 80) {
                    currentIndex = index
                }
            })
            if (detectItem === currentIndex) return
            detectItem = currentIndex
            document.querySelectorAll('.toc .active').forEach((i) => {
                i.classList.remove('active')
            })
            const activeitem = toc[detectItem]
            if (activeitem) {
                let parent = toc[detectItem].parentNode
                activeitem.classList.add('active')
                autoScroll(activeitem)
                for (; !parent.matches('.toc'); parent = parent.parentNode) {
                    if (parent.matches('li')) parent.classList.add('active')
                }
            }
        }

        window.tocScrollFn = utils.throttle(function () {
            const currentTop = window.scrollY || document.documentElement.scrollTop
            findHeadPosition(currentTop)
        }, 100)
        window.addEventListener('scroll', tocScrollFn)
    }
}

/**
 * tabs
 * @description 外挂标签tabs
 */
class tabs {
    static init() {
        this.clickFnOfTabs()
        this.backToTop()
    }

    static clickFnOfTabs() {
        document.querySelectorAll('#article-container .tab > button').forEach(item => {
            item.addEventListener('click', e => {
                const $tabItem = e.target.parentNode
                if (!$tabItem.classList.contains('active')) {
                    const $tabContent = $tabItem.parentNode.nextElementSibling
                    const $siblings = $tabItem.parentNode.querySelector('.active')
                    $siblings && $siblings.classList.remove('active')
                    $tabItem.classList.add('active')
                    const tabId = e.target.getAttribute('data-href').replace('#', '')
                    Array.from($tabContent.children).forEach(item => {
                        item.id === tabId ? item.classList.add('active') : item.classList.remove('active')
                    })
                }
            })
        })
    }

    static backToTop() {
        document.querySelectorAll('#article-container .tabs .tab-to-top').forEach(item => {
            item.addEventListener('click', () => {
                utils.scrollToDest(utils.getEleTop(item.closest('.tabs')), 300)
            })
        })
    }
}

// 页面刷新
window.refreshFn = () => {
    const {is_home, is_page, page, is_post} = PAGE_CONFIG;
    const {runtime, lazyload, lightbox, randomlink, covercolor, post_ai} = GLOBAL_CONFIG;
    const timeSelector = (is_home ? '.post-meta-date time' : is_post ? '.post-meta-date time' : '.datatime') + ', .webinfo-item time';
    document.body.setAttribute('data-type', page);
    flec.changeTimeFormat(document.querySelectorAll(timeSelector));
    runtime && flec.addRuntime();
    [scrollFn, sidebarFn, flec.hideCookie, flec.addPhotoFigcaption, flec.setTimeState, flec.tagPageActive, flec.categoriesBarActive, flec.listenToPageInputPress, flec.addNavBackgroundInit, flec.refreshWaterFall].forEach(fn => fn());
    lazyload.enable && utils.lazyloadImg();
    lightbox && utils.lightbox(document.querySelectorAll("#article-container img:not(.flink-avatar,.gallery-group img)"));
    randomlink && randomLinksList();
    post_ai && is_post && flec_ai.init();
    flec.switchComments();
    initObserver();
    if (is_home) showTodayCard();
    if (is_post || is_page) {
        addHighlight();
        tabs.init();
    }
    if (covercolor.enable) coverColor();
    if (PAGE_CONFIG.toc) toc.init();
    if (location.pathname == '/photos/') flec.photos()
    if (location.pathname == '/album/') flec.photos()
}
window.onresize = () => {
    if (location.pathname == '/photos/') waterfall('.gallery-photos');
    if (location.pathname == '/album/') waterfall('.gallery-photos');
};
// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    [addCopyright, flec.initConsoleState, window.refreshFn, asideStatus, () => window.onscroll = percent].forEach(fn => fn());
});
// 监听切换标签页
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        wasPageHidden = true;
    }
});
// 一些快捷键绑定
window.onkeydown = e => {
    const {keyCode, ctrlKey, shiftKey} = e;
    if (keyCode === 123 || (ctrlKey && shiftKey && keyCode === 67)) utils.snackbarShow(GLOBAL_CONFIG.lang.f12, false, 3000);
    if (keyCode === 27) flec.hideConsole();
};
// 复制成功提示
document.addEventListener('copy', () => utils.snackbarShow(GLOBAL_CONFIG.lang.copy.success, false, 3000));

// 侧边栏-那年今日 start
document.addEventListener('DOMContentLoaded', function () {
    async function cardHistory() {
        const historyContainer = document.getElementById('history-container');
        if (!historyContainer) return;
        const data = await fetchHistoryData();
        const html = data.map(item => `<div class="swiper-slide history_slide"><span class="history_slide_time">A.D.${item.year}</span><span class="history_slide_link">${item.title}</span></div>`).join('');
        const swiperContainer = document.querySelector('.history_swiper-container');
        document.getElementById('history_container_wrapper').innerHTML = html
        const swiperHistory = new Swiper(swiperContainer, {
            loop: true,
            direction: 'vertical',
            autoplay: {disableOnInteraction: true, delay: 5000},
            mousewheel: false,
        });
        historyContainer.onmouseenter = () => swiperHistory.autoplay.stop();
        historyContainer.onmouseleave = () => swiperHistory.autoplay.start();
  
        async function fetchHistoryData() {
            const myDate = new Date();
            const formattedDate = 'S' + `${myDate.getMonth() + 1}`.padStart(2, '0') + `${myDate.getDate()}`.padStart(2, '0');
            const historyDataUrl = `https://fastly.jsdelivr.net/gh/Zfour/Butterfly-card-history@2.08/baiduhistory/json/${myDate.getMonth() < 10 ? '0' + (myDate.getMonth() + 1) : myDate.getMonth() + 1}.json`;
            const response = await fetch(historyDataUrl);
            const data = await response.json();
            return data[formattedDate];
        }
    }
    cardHistory()
    document.addEventListener('pjax:complete', cardHistory);
  })
  // 侧边栏-那年今日 end

// 侧边栏-日历卡片 start
document.addEventListener("DOMContentLoaded", () => {
    initializeCard();
});

document.addEventListener("pjax:complete", () => {
    initializeCard();
});

function initializeCard() {
    cardTimes();
    cardRefreshTimes();
}

let year, month, week, date, dates, weekStr, monthStr, asideTime, asideDay, asideDayNum, animalYear, ganzhiYear, lunarMon, lunarDay;
const now = new Date();

function cardRefreshTimes() {
    const e = document.getElementById("card-widget-schedule");
    if (e) {
        asideDay = (now - asideTime) / 1e3 / 60 / 60 / 24;
        e.querySelector("#pBar_year").value = asideDay;
        e.querySelector("#p_span_year").innerHTML = (asideDay / 365 * 100).toFixed(1) + "%";
        e.querySelector(".schedule-r0 .schedule-d1 .aside-span2").innerHTML = `还剩<a> ${(365 - asideDay).toFixed(0)} </a>天`;
        e.querySelector("#pBar_month").value = date;
        e.querySelector("#pBar_month").max = dates;
        e.querySelector("#p_span_month").innerHTML = (date / dates * 100).toFixed(1) + "%";
        e.querySelector(".schedule-r1 .schedule-d1 .aside-span2").innerHTML = `还剩<a> ${(dates - date)} </a>天`;
        e.querySelector("#pBar_week").value = week === 0 ? 7 : week;
        e.querySelector("#p_span_week").innerHTML = ((week === 0 ? 7 : week) / 7 * 100).toFixed(1) + "%";
        e.querySelector(".schedule-r2 .schedule-d1 .aside-span2").innerHTML = `还剩<a> ${(7 - (week === 0 ? 7 : week))} </a>天`;
    }
}

function cardTimes() {
    year = now.getFullYear();
    month = now.getMonth();
    week = now.getDay();
    date = now.getDate();

    const e = document.getElementById("card-widget-calendar");
    if (e) {
        const isLeapYear = year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
        weekStr = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][week];
        const monthData = [
            { month: "1月", days: 31 },
            { month: "2月", days: isLeapYear ? 29 : 28 },
            { month: "3月", days: 31 },
            { month: "4月", days: 30 },
            { month: "5月", days: 31 },
            { month: "6月", days: 30 },
            { month: "7月", days: 31 },
            { month: "8月", days: 31 },
            { month: "9月", days: 30 },
            { month: "10月", days: 31 },
            { month: "11月", days: 30 },
            { month: "12月", days: 31 }
        ];
        monthStr = monthData[month].month;
        dates = monthData[month].days;

        const t = (week + 8 - date % 7) % 7;
        let n = "", d = false, s = 7 - t;
        const o = (dates - s) % 7 === 0 ? Math.floor((dates - s) / 7) + 1 : Math.floor((dates - s) / 7) + 2;
        const c = e.querySelector("#calendar-main");
        const l = e.querySelector("#calendar-date");

        l.style.fontSize = ["64px", "48px", "36px"][Math.min(o - 3, 2)];

        for (let i = 0; i < o; i++) {
            if (!c.querySelector(`.calendar-r${i}`)) {
                c.innerHTML += `<div class='calendar-r${i}'></div>`;
            }
            for (let j = 0; j < 7; j++) {
                if (i === 0 && j === t) {
                    n = 1;
                    d = true;
                }
                const r = n === date ? " class='now'" : "";
                if (!c.querySelector(`.calendar-r${i} .calendar-d${j} a`)) {
                    c.querySelector(`.calendar-r${i}`).innerHTML += `<div class='calendar-d${j}'><a${r}>${n}</a></div>`;
                }
                if (n >= dates) {
                    n = "";
                    d = false;
                }
                if (d) {
                    n += 1;
                }
            }
        }

        const lunarDate = chineseLunar.solarToLunar(new Date(year, month, date));
        animalYear = chineseLunar.format(lunarDate, "A");
        ganzhiYear = chineseLunar.format(lunarDate, "T").slice(0, -1);
        lunarMon = chineseLunar.format(lunarDate, "M");
        lunarDay = chineseLunar.format(lunarDate, "d");

        const newYearDate = new Date("2026/02/16 00:00:00");
        const daysUntilNewYear = Math.floor((newYearDate - now) / 1e3 / 60 / 60 / 24);
        asideTime = new Date(`${new Date().getFullYear()}/01/01 00:00:00`);
        asideDay = (now - asideTime) / 1e3 / 60 / 60 / 24;
        asideDayNum = Math.floor(asideDay);
        const weekNum = week - asideDayNum % 7 >= 0 ? Math.ceil(asideDayNum / 7) : Math.ceil(asideDayNum / 7) + 1;

        e.querySelector("#calendar-week").innerHTML = `第${weekNum}周&nbsp;${weekStr}`;
        e.querySelector("#calendar-date").innerHTML = date.toString().padStart(2, "0");
        e.querySelector("#calendar-solar").innerHTML = `${year}年${monthStr}&nbsp;第${asideDay.toFixed(0)}天`;
        e.querySelector("#calendar-lunar").innerHTML = `${ganzhiYear}${animalYear}年&nbsp;${lunarMon}${lunarDay}`;
        document.getElementById("schedule-days").innerHTML = daysUntilNewYear;
    }
}
// 侧边栏-日历卡片 end
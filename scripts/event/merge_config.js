hexo.extend.filter.register('before_generate', () => {
    const defaultConfig = {
        site: {
            favicon: '/img/favicon.ico',
            avatar: '/img/avatar.png'
        },
        nav: {
            group: null,
            logo: {
                class: 'text',
                custom: 'FlecUI'
            },
            menu: null,
            button: {
                random: false,
                console: false,
                custom: [],
            }
        },
        hometop: {
            enable: false,
            banner: {
                title: '前景可待<br>未来可期',
                text: 'Hexo Theme FlecUI',
                icon: null,
            },
            group: null,
            recommendList: {
                sup: '置顶',
                title: 'FlecUI 主题文档',
                url: 'https://flecui.talen.top/',
                img: '/img/default.png',
                color: 'none',
            }
        },
        aside: {
            home: {
                noSticky: 'about',
                Sticky: 'allInfo'
            },
            post: {
                noSticky: 'about',
                Sticky: 'newestPost'
            },
            page: {
                noSticky: 'about',
                Sticky: 'newestPost,allInfo'
            },
            card: {
                style: 0,
                author: {
                    img: '/img/avatar.png',
                    sticker: '/img/happy-sticker.png',
                },
                url: '/about/',
                background: null,
                sayhello: {
                    morning: 'Good Morning',
                    noon: 'Good Noon',
                    afternoon: 'Good Afternoon',
                    night: 'Good Night',
                    goodnight: 'Good Night',
                },
                sayhello2: ['Welcome to FlecUI', 'A simple theme for Hexo', 'Enjoy your time', 'Have a nice day', 'Good luck'],
                content: '永远相信美好的事情即将发生。',
                information: null,
                button: {
                    enable: true,
                    text: 'Subscribe to me',
                    url: '/subscribe/'
                }
            },
            flip: {
                favicon: '',
                face: '',
                backface: '',
                backcolor: 'var(--flec-blue)'
            },
            toc: {
                post: true,
                page: false,
                vague: true,
            },
            tags: {
                enable: false,
                limit: 20,
                list: [],
            },
            archive: {
                enable: true,
                type: 'month'
            },
            siteinfo: {
                postcount: true,
                wordcount: true,
                pv: true,
                uv: true,
                updatetime: true,
                runtimeenable: true,
                runtime: "2024-01-01 00:00:00",
            },
        },
        index_post_list: {
            direction: 'column',
            cover: 'both',
            content: false,
            length: 500
        },
        page: {
            error: true,
            tags: true,
            categories: true,
            default: {
                cover: ['/img/default.png'],
            }
        },
        post: {
            default: {
                cover: ['/img/default.png'],
                locate: 'China, Jining',
                copyright: {
                    enable: true,
                    license: 'CC BY-NC-SA 4.0',
                    licenurl: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
                }
            },
            meta: {
                date: false,
                updated: false,
                locate: false,
                wordcount: false,
                readtime: false,
                pv: false,
                comment: false,
            },
            award: {
                enable: false,
                title: '感谢您的赞赏。',
                desc: '因为有你们的支持，我才体会到写文章的价值。',
                appreciators: '/',
                list: [],
            },
            share: {
                enable: false,
                list: []
            },
            rss: null,
            covercolor: {
                enable: false,
                mode: 'local',
                api: 'https://api.qjqq.cn/api/Imgcolor?img=',
                time: 43200000,
            }
        },
        theme_color: {
            dark: "#DEB247",
            dark_op: "#DEB24723",
            dark_op_deep: "#DEB247DD",
            dark_none: "#DEB24700",
            light: "#8042EF",
            light_op: "#8042EF23",
            light_op_deep: "#8042EFDD",
            light_none: "#8042EF01"
        },
        display_mode: {
            type: 'auto',
            universe: false
        },
        related_post: {
            enable: false,
            limit: 2,
            date_type: 'created'
        },
        footer: {
            information: {
                author: {
                    enable: false,
                    image: '/img/avatar.png',
                },
                left: null,
                right: null,
            },
            group: null,
            randomlink: false,
            privacy: null,
            license: null,
            links: [{
                name: '关于',
                url: '/about/',
            }]
        },
        errorpage: {
            img: '/img/404.png',
            text: '404 Not Found',
            recommendList: true
        },
        subscribe: {
            follow: ''
        },
        says: {
            enable: false,
            strip: 30,
            home_mini: false,
            style: 0
        },
        recent_comments: {
            enable: false,
            limit: 50,
            cache: 0.2,
            console: false,
            page: '/recentcomments/'
        },
        envelope: {
            enable: false,
            line: 10,
            speed: 20,
            hover: true,
            loop: true,
            page: '/message/'
        },
        meting_api: "https://meting.qjqq.cn/?server=:server&type=:type&id=:id&auth=:auth&r=:r",
        music: {
            enable: false,
            id: '1994908354',
            server: 'netease',
            type: 'playlist',
            volume: 0.8,
            mutex: true,
        },
        capsule: {
            enable: false,
            id: '1994908354',
            server: 'netease',
            type: 'playlist',
        },
        keyboard: {
            enable: false,
            list: []
        },
        lazyload: {
            enable: false,
            field: 'site',
            placeholder: '/img/loading.gif',
            errorimg: '/img/error_load.webp'
        },
        loading: {
            fullpage: {
                enable: false,
                image: '/img/avatar.png',
            },
            pace: true,
        },
        highlight: {
            enable: true,
            limit: 200,
            copy: true,
            expand: true,
            theme: 'default',
            color: 'default',
        },
        lightbox: false,
        mermaid: false,
        OpenGraph: {
            enable: false,
            options: null
        },
        wordcount: false,
        busuanzi: false,
        busuanzi_use: 0,
        search: {
            enable: false,
            type: 'local',
            tags: [],
            algolia: null,
            local: {
                preload: false,
                CDN: null,
            }
        },
        rightside: {
            enable: false
        },
        copy: {
            enable: false,
            copyright: {
                enable: false,
                limit: 50
            }
        },
        post_ai: {
            enable: false,
            modelName: 'FlecGPT',
            key: 'xxxxxxxxxxxx',
            talk: 'I am FlecGPT.',
            randomPost: false,
            tips: 'AI is not perfect, please use it with caution.'
        },
        katex: {
            enable: false,
            per_page: false,
            copytex: false,
        },
        comment: {
            use: null,
            commentBarrage: false,
            lazyload: false,
            count: false,
            pv: false,
            avatar: 'https://cravatar.cn',
            newest_comment: {
                enable: false,
                storage: .2
            }
        },
        twikoo: {
            envId: 'your envId',
            region: null,
            style: true,
            accessToken: null,
            option: null,
        },
        waline: {
            envId: 'your envId',
            pageview: true,
            option: null,
        },
        valine: {
            appId: 'your appId',
            appKey: 'your appKey',
            serverURLs: 'your serverURLs',
            avatar: 'monsterid',
            visitor: false,
            style: true,
            option: null,
        },
        artalk: {
            server: 'your server',
            site: 'your site-name',
            option: null,
        },
        console_plus: false,
        verify_site: [],
        css_prefix: false,
        font: {
            'font-size': '16px',
            'code-font-size': '16px',
            'font-family': 'PingFang SC, Hiragino Sans GB,Microsoft YaHei',
            'code-font-family': 'monospace, monospace',
        },
        extends: {
            head: [],
            body: [],
        },
        pwa: {
            enable: false,
            manifest: '/manifest.json',
            theme_color: "#006a73",
            mask_icon: '/img/logo.png',
            apple_touch_icon: '/img/logo.png',
            bookmark_icon: '/img/logo.png',
            favicon_32_32: '/img/logo.png',
            favicon_16_16: '/img/logo.png'
        },
        google_adsense: {
            enable: false,
            auto_ads: false,
            aside_card: false,
            post_card: false,
            post_content: false,
            enable_page_level_ads: false,
            js: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
            client: '',
            slot: '',
        },
        right_menu: {
            enable: false,
            commentBarrage: false,
            translate: {
                enable: false,
                defaultEncoding: 2,
                translateDelay: 0,
            },
            custom_list: []
        },
        CDN: {
            internal: 'local',
            third_party: 'cdnjs',
            version: true,
            custom_format: 'https://cdn.staticfile.net/${cdnjs_name}/${version}/${min_cdnjs_file}',
            option: {
                flecicon_css: 'https://cdn2.codesign.qq.com/icons/7pOrz0WXB5ZWJPX/latest/iconfont.css',
            }
        }
    }
    hexo.theme.config = Object.assign(defaultConfig, hexo.theme.config)
}, 1)
'use strict';

hexo.extend.filter.register('before_post_render', () => {
        const data = hexo.locals.get('data');
        const logger = hexo.log;
        const theme = hexo.theme.config;
        if (theme.hometop.enable && !theme.hometop.banner.icon) {
            logger.error('\n 启用banner的情况下，必须提供 icon 图片！\n 请在主题配置文件中设置 hometop.banner.icon 选项。');
            logger.error('\n If banner is enabled, icon image must be supplied! \n Please set the hometop.banner.icon option in the theme configuration file.');
            process.exit(-1);
        }
        if (theme.footer.randomlink && !data.links){
            logger.error('\n 启用随机链接的情况下，必须提供 links 数据！\n 请新建 links.yaml。');
            logger.error('\n If randomlink is enabled, links data must be supplied! \n Please create links.yaml.');
            process.exit(-1);
        }
    }
);
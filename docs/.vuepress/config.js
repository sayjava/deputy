const { description } = require('../../package');
const { version } = require('../../package');

module.exports = {
    base: '/deputy/',

    /**
     * Ref：https://v1.vuepress.vuejs.org/config/#title
     */
    title: 'Deputy',
    /**
     * Ref：https://v1.vuepress.vuejs.org/config/#description
     */
    description,

    /**
     * Extra tags to be injected to the page HTML `<head>`
     *
     * ref：https://v1.vuepress.vuejs.org/config/#head
     */
    head: [
        ['meta', { name: 'theme-color', content: '#3eaf7c' }],
        ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
        ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ],

    /**
     * Theme configuration, here is the default theme configuration for VuePress.
     *
     * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
     */
    themeConfig: {
        version,
        repo: 'sayjava/deputy',
        editLinks: false,
        docsDir: 'docs',
        editLinkText: '',
        lastUpdated: false,
        logo: '/assets/img/landing.svg',
        nav: [
            {
                text: 'Start',
                link: '/start',
            },
            {
                text: 'Guide',
                link: '/guide',
            },
            {
                text: 'Assertions',
                link: '/assertions',
            },
            {
                text: 'API',
                link: '/api',
            },
        ],
        sidebar: ['/', '/start', '/guide', '/assertions', '/api'],
    },

    /**
     * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
     */
    plugins: ['@vuepress/plugin-back-to-top', '@vuepress/plugin-medium-zoom'],

    evergreen: true,
};

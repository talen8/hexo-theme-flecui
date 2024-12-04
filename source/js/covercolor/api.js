const coverColor = () => {
    const path = document.getElementById("post-cover")?.src;
    path ? handleApiColor(path) : setDefaultThemeColors();
}

function handleApiColor(path) {
    const cacheGroup = JSON.parse(localStorage.getItem('FlecUI')) || {};
    cacheGroup.postcolor && cacheGroup.postcolor[path] ? setThemeColors(cacheGroup.postcolor[path].value) : img2color(path);
}

function img2color(src) {
    fetch(coverColorConfig.api + encodeURIComponent(src))
        .then(response => response.json())
        .then(data => {
            setThemeColors(data.RGB);
            cacheColor(src, data.RGB);
        })
        .catch(console.error);
}

function setThemeColors(value) {
    if (value) {
        const [r, g, b] = value.match(/\w\w/g).map(x => parseInt(x, 16));
        document.documentElement.style.setProperty('--flec-main', value);
        document.documentElement.style.setProperty('--flec-main-op', value + '23');
        document.documentElement.style.setProperty('--flec-main-op-deep', value + 'dd');
        document.documentElement.style.setProperty('--flec-main-none', value + '00');
        adjustBrightness(r, g, b);
        document.getElementById("coverdiv").classList.add("loaded");
        initThemeColor();
    } else {
        setDefaultThemeColors();
    }
}

function setDefaultThemeColors() {
    document.documentElement.style.setProperty('--flec-main', 'var(--flec-theme)');
    document.documentElement.style.setProperty('--flec-main-op', 'var(--flec-theme-op)');
    document.documentElement.style.setProperty('--flec-main-op-deep', 'var(--flec-theme-op-deep)');
    document.documentElement.style.setProperty('--flec-main-none', 'var(--flec-theme-none)');
    initThemeColor();
}

function cacheColor(src, color) {
    const cacheGroup = JSON.parse(localStorage.getItem('FlecUI')) || {};
    cacheGroup.postcolor = cacheGroup.postcolor || {};
    cacheGroup.postcolor[src] = {value: color, expiration: Date.now() + coverColorConfig.time};
    localStorage.setItem('FlecUI', JSON.stringify(cacheGroup));
}

function adjustBrightness(r, g, b) {
    if (Math.round(((r * 299) + (g * 587) + (b * 114)) / 1000) < 125) {
        [...document.getElementsByClassName('card-content')].forEach(item => item.style.setProperty('--flec-card-bg', 'var(--flec-white)'));
        [...document.getElementsByClassName('author-info__sayhi')].forEach(item => {
            item.style.setProperty('background', 'var(--flec-white-op)');
            item.style.setProperty('color', 'var(--flec-white)');
        });
    }
}
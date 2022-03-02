const deviceType = () => {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return "tablet";
    }
    else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return "mobile";
    }
    return "desktop";
};

if (deviceType() != "desktop") {
    document.body.remove();
    document.write(`<h1>${returnTranslation('mobile_alert')}</h1>`);
    document.currentScript.remove();
};

function set_language(lang) {
    window.localStorage.setItem('lang', lang);
    window.location.reload();
};

const lang_buttons = document.querySelectorAll('.flag');

lang_buttons.forEach((lang_btn) => {
    let lang = window.localStorage.getItem('lang');

    if (lang == lang_btn.dataset.lang) {
        lang_btn.classList.add('active');
        lang_btn.onclick = function () { };
    } else {
        lang_btn.classList.remove('active');
        lang_btn.addEventListener('click', function (e) {
            set_language(e.target.dataset.lang);
        });
    };
});
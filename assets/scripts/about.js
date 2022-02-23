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
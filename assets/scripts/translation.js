function getTranslation(data) {
    if (navigator.language == "uk-UA" || navigator.language == "uk" && !window.localStorage.getItem('lang')) {
        document.write(uk_ua[data]);
    } else if (window.localStorage.getItem('lang') == "uk_ua") {
        document.write(uk_ua[data]);
    } else {
        document.write(en_us[data]);
    };
    document.currentScript.remove();
};

function returnTranslation(data) {
    if (navigator.language == "uk-UA" || navigator.language == "uk" && !window.localStorage.getItem('lang')) {
        return uk_ua[data];
    } else if (window.localStorage.getItem('lang') == "uk_ua") {
        return uk_ua[data];
    } else {
        return en_us[data];
    };
};

if (!window.localStorage.getItem('lang')) {
    if (navigator.language == "uk-UA" || navigator.language == "uk") {
        window.localStorage.setItem('lang', "uk_ua");
    } else {
        window.localStorage.setItem('lang', "en_us");
    };
};
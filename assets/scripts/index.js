const projects = JSON.parse(window.localStorage.getItem('projects'));

if (projects == [] || projects == null || projects == undefined) {
    window.location.replace('index.html');
};

let filtered_projects = projects.filter(checkSelected);

if (filtered_projects.length == 0 || filtered_projects == null || filtered_projects == undefined) {
    window.location.replace('index.html');
};

function checkSelected(project) {
    return project.selected == true;
};

let project_index = projects.indexOf(projects.filter(checkSelected)[0]);

const canvas = document.querySelector("#canvas");
const color_picker = document.querySelector('.color-picker');
const size_slider = document.querySelector('.draw_size-slider');

canvas.width = canvas.parentElement.offsetWidth;
canvas.height = canvas.parentElement.offsetHeight;

let context = canvas.getContext("2d");
let background_fill = projects[project_index].color;
context.fillStyle = background_fill;
context.fillRect(0, 0, canvas.width, canvas.height);

let draw_color = "black";
let draw_width = "2";
let is_drawing = false;
let current_tool = "default";

projects[project_index].slide_index = 0;
window.localStorage.setItem('projects', JSON.stringify(projects));

document.title = `${projects[project_index].title} - Ovimation`;

window.onresize = () => {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
    context.fillStyle = background_fill;
    context.fillRect(0, 0, canvas.width, canvas.height);
    var img = new Image;
    img.src = projects[project_index].slides[projects[project_index].slide_index];
    context.drawImage(img, 0, 0);
};

if (projects[project_index].slides == []) {
    projects[project_index].slides.push(canvas.toDataURL());
    window.localStorage.setItem('projects', JSON.stringify(projects));
    window.localStorage.setItem('projects', JSON.stringify(projects));
} else {
    const animation_slides = document.querySelector('.animation-slides div');
    projects[project_index].slide_index = 0;
    var img = new Image;
    img.src = projects[project_index].slides[0];
    context.drawImage(img, 0, 0);
    document.querySelector('img.default-slide')
        .src = projects[project_index].slides[0];

    for (var i = 0; i < projects[project_index].slides.length; i++) {
        if (i != 0) {
            animation_slides.insertAdjacentHTML('beforeend', `<li><ul class="slide-options"><li class="slide-option" onclick="delete_slide(this, ${i})"><p style="font-size: 28px; margin-top: -11px; text-align: center;">&times;</p></li></ul><div class="slide-wrapper" onclick="set_slide(this, ${i})"><img class="default-slide" src="${projects[project_index].slides[i]}" alt="Slide ${projects[project_index].slides[i]}"></div></li>`);
        };
    };
    window.localStorage.setItem('projects', JSON.stringify(projects));
};

document.querySelector('img.default-slide')
    .src = canvas.toDataURL();

if (window.localStorage.getItem('draw_color')) {
    color_picker.value = window.localStorage.getItem('draw_color');
    draw_color = window.localStorage.getItem('draw_color');
};

if (window.localStorage.getItem('draw_width')) {
    size_slider.value = window.localStorage.getItem('draw_width');
    draw_width = window.localStorage.getItem('draw_width');
};

document.getElementById('draw_width-value')
    .innerText = `${draw_width}px`

projects[project_index].slides[projects[project_index].slide_index] = canvas.toDataURL();
window.localStorage.setItem('projects', JSON.stringify(projects));

canvas.addEventListener('touchstart', start, false);
canvas.addEventListener('touchmove', draw, false);
canvas.addEventListener('mousedown', start, false);
canvas.addEventListener('mousemove', draw, false);

canvas.addEventListener('touchend', stop, false);
canvas.addEventListener('mouseup', stop, false);
canvas.addEventListener('mouseout', stop, false);

canvas.addEventListener('touch', draw_dot, false);
canvas.addEventListener('click', draw_dot, false);

function start(e) {
    is_drawing = true;
    context.beginPath();
    context.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    e.preventDefault();
};

function draw(e) {
    if (is_drawing) {
        context.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        if (current_tool == "eraser") {
            context.strokeStyle = background_fill;
        } else {
            context.strokeStyle = draw_color;
        };
        context.lineWidth = draw_width;
        context.lineCap = "round";
        context.lineJoin = "round";
        context.stroke();
    };
    e.preventDefault();
};

function stop(e) {
    if (is_drawing) {
        context.stroke();
        context.closePath();
        is_drawing = false;
        document.querySelector('img.default-slide')
            .src = canvas.toDataURL();
        window.localStorage.setItem('projects', JSON.stringify(projects));
    };
    e.preventDefault();

    if (e.type != "mouseout") {
        projects[project_index].slides[projects[project_index].slide_index] = canvas.toDataURL();
        window.localStorage.setItem('projects', JSON.stringify(projects));
    };
};

function draw_dot(e) {
    start(e);
    draw(e);
    stop(e);
};

function set_tool(element, tool) {
    for (el of document.querySelectorAll("ul.toolbar li")) {
        el.classList.remove('active');
    };

    if (tool == "default") {
        draw_color = color_picker.value;
        current_tool = "default";
    } else if (tool == "eraser") {
        draw_color = background_fill;
        current_tool = "eraser";
    };

    element.classList.add('active');
};

function add_slide() {
    if (projects[project_index].slides.length < 30) {
        for (slide_img of document.querySelectorAll(".animation-slides div li img")) {
            slide_img.classList.remove('default-slide');
        };

        for (slide of document.querySelectorAll(".animation-slides div li.active")) {
            slide.classList.remove('active');
        };

        const animation_slides = document.querySelector('.animation-slides div#slides');
        animation_slides.insertAdjacentHTML('beforeend', `<li class="active"><ul class="slide-options"><li class="slide-option" onclick="delete_slide(this, ${projects[project_index].slide_index + 1})"><p style="font-size: 28px; margin-top: -11px; text-align: center;">&times;</p></li></ul><div class="slide-wrapper" onclick="set_slide(this, ${projects[project_index].slide_index + 1})"><img class="default-slide" src="" alt="Slide ${projects[project_index].slide_index + 1}"></div></li>`);

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillRect(0, 0, canvas.width, canvas.height);

        projects[project_index].slides.push(canvas.toDataURL());
        projects[project_index].slide_index += 1;

        window.localStorage.setItem('projects', JSON.stringify(projects));
        document.querySelector('img.default-slide')
            .src = canvas.toDataURL();
    } else {
        alert(returnTranslation('slide_alert'));
    };
};

function set_slide(e, slide_no) {
    if (projects[project_index].slides[slide_no]) {
        for (slide_img of document.querySelectorAll(".animation-slides div li img.default-slide")) {
            slide_img.classList.remove('default-slide');
        };
        for (slide of document.querySelectorAll(".animation-slides div li.active")) {
            slide.classList.remove('active');
        };
        projects[project_index].slide_index = slide_no;
        var img = new Image;
        img.src = projects[project_index].slides[slide_no];
        context.drawImage(img, 0, 0);
        e.children[0].classList.add('default-slide');
        e.parentElement.parentElement.classList.add('active');
        window.localStorage.setItem('projects', JSON.stringify(projects));
    };
};

function convert_slides(e, operation) {
    e.innerHTML = `<div class="loader"></div>`;
    e.onclick = function () { };

    var gif = new GIF({
        workers: 2
        , quality: 10
        , width: canvas.width
        , height: canvas.height
    });

    for (sld of document.querySelectorAll('.animation-slides div li img')) {
        gif.addFrame(sld, {
            delay: 1000 / projects[project_index].fps
        });
    };

    gif.on('finished', function (blob) {
        if (operation == "play") {
            e.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-stop-fill" viewBox="0 0 13 13">
            <path d="M5 3.5h6A1.5 1.5 0 0 1 12.5 5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 11V5A1.5 1.5 0 0 1 5 3.5z"/>
          </svg>`;
            e.onclick = stop_convert;
            document.querySelector('img.animation-result')
                .style.display = "block";
            document.querySelector('#canvas')
                .style.display = "none";
            document.querySelector('img.animation-result')
                .src = URL.createObjectURL(blob);
        } else if (operation == "download") {
            e.href = URL.createObjectURL(blob);
            e.download = `${projects[project_index].title}.gif`;
            e.click();
            e.removeAttribute("href");
            e.removeAttribute("download");
            e.innerHTML = `Завантажити як GIF`;
            e.onclick = function () {
                convert_slides(e, "download");
            };
        };
    });

    gif.render();
};

function stop_convert() {
    document.querySelector('button.btn.play-animation')
        .onclick = function () {
            convert_slides(document.querySelector('button.btn.play-animation'), "play");
        };
    document.querySelector('button.btn.play-animation')
        .innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"
    fill="currentColor" class="bi bi-play-fill" viewBox="0 0 13 13">
    <path
        d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
</svg>`;
    document.querySelector('img.animation-result')
        .style.display = "none";
    document.querySelector('#canvas')
        .style.display = "block";
    document.querySelector('img.animation-result')
        .src = "";
};

function to_home() {
    for (p of projects) {
        p.selected = false;
    };

    window.localStorage.setItem('projects', JSON.stringify(projects));
    window.location.replace('index.html');
};

function reset_slides() {
    let slides_wrapper = document.querySelectorAll('div#slides li:not(:first-child)');

    slides_wrapper.forEach((sld) => {
        sld.remove();
    });

    for (var i = 0; i < projects[project_index].slides.length; i++) {
        if (i != 0) {
            document.querySelector('div#slides').insertAdjacentHTML('beforeend', `<li><ul class="slide-options"><li class="slide-option" onclick="delete_slide(this, ${i})"><p style="font-size: 28px; margin-top: -11px; text-align: center;">&times;</p></li></ul><div class="slide-wrapper" onclick="set_slide(this, ${i})"><img class="default-slide" src="${projects[project_index].slides[i]}" alt="Slide ${i}"></div></li>`);
        };
    };
};

function delete_slide(e, slide_id) {
    if (slide_id > 0 && projects[project_index].slides[slide_id]) {
        delete projects[project_index].slides[slide_id];
        projects[project_index].slides = projects[project_index].slides.filter(function (el) {
            return el != null;
        });

        if (slide_id == projects[project_index].slide_index) {
            projects[project_index].slide_index -= 1;
        };

        reset_slides();
        set_slide(document.querySelector('#slides').children[projects[project_index].slide_index].querySelector('div'), projects[project_index].slide_index);
        window.localStorage.setItem('projects', JSON.stringify(projects));
        e.parentElement.parentElement.remove();
    };
};

function openDropdown() {
    document.getElementById("dropdown").classList.toggle("show");
};

var new_slide_btn = document.getElementById('new-slide');

new_slide_btn.setAttribute('title', returnTranslation('new_slide'));

// BETA TESTING

$('#canvas').click(function(e) {
    var pos = findPos(this);
    var x = e.pageX - pos.x;
    var y = e.pageY - pos.y;
    var c = this.getContext('2d');
    var p = c.getImageData(x, y, 1, 1).data; 
    var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
    console.log(hex);
});

function findPos(obj) {
    var curleft = 0, curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return { x: curleft, y: curtop };
    }
    return undefined;
}

function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}
let projects = JSON.parse(window.localStorage.getItem('projects'));

var modals = document.querySelectorAll(".modal");
var spans = document.querySelectorAll(".close");

for (project of projects) {
    if (project.selected == true) {
        window.location.replace('project.html');
    };
};

spans.forEach((span) => {
    span.onclick = function () {
        span.parentElement.parentElement.parentElement.style.display = "none";
        if (span.parentElement.parentElement.parentElement.id == "newProjectModal") {
            refresh_modal();
        };
    };
});

modals.forEach((modal) => {
    window.onclick = function (e) {
        if (e.target == modal) {
            modal.style.display = "none";
            if (modal.id == "newProjectModal") {
                refresh_modal();
            };
        };
    };
});

function refresh_modal() {
    const title = document.querySelector('#project-title');
    const color = document.querySelector('#background-fill');
    const fps = document.querySelector('#fps');
    const drmttpp = document.querySelector('#drmttpp');

    title.value = `${returnTranslation('my_project')} ${projects.length + 1}`;
    color.value = '#ffffff';
    fps.value = 5;
    drmttpp.checked = false;
};

function open_modal(modal) {
    if (modal.id == "newProjectModal" && projects.length >= 25) {
        alert(returnTranslation('projects_alert'));
    } else {
        if (window.localStorage.getItem('projects') == null || window.localStorage.getItem('projects') == undefined) {
            window.localStorage.setItem('projects', JSON.stringify([]));
        };

        document.querySelector('#project-title').value = `${returnTranslation('my_project')} ${projects.length + 1}`;

        if (modal.id == "editProjectModal") {
            set_project_data_to_modal();
        };

        modal.style.display = "block";
    };
};

function create_project(title, color, fps, drmttpp) {
    if (projects.length < 25) {
        if (window.localStorage.getItem('projects') == null || window.localStorage.getItem('projects') == undefined) {
            window.localStorage.setItem('projects', JSON.stringify([]));
        };

        if (title == '' || title == null || title == undefined) {
            title = `${returnTranslation('my_project')} ${projects.length + 1}`;
        };

        if (projects != [] && projects != null && projects != undefined) {
            for (p of projects) {
                p.selected = false;
            };
        };

        projects.push(
            {
                title: title,
                color: color,
                fps: fps,
                selected: true,
                slides: [],
                slide_index: 0
            }
        );
        window.localStorage.setItem('projects', JSON.stringify(projects));
        if (drmttpp == true) {
            projects.at(-1).selected = false;
            var cnv = document.createElement('canvas');
            cnv.width = (80.5 / 100) * window.innerWidth;
            cnv.height = window.innerHeight;
            var context = cnv.getContext("2d");
            var background_fill = projects.at(-1).color;
            context.fillStyle = background_fill;
            context.fillRect(0, 0, cnv.width, cnv.height);
            projects.at(-1).slides.push(cnv.toDataURL());
            cnv.remove();
            window.localStorage.setItem('projects', JSON.stringify(projects));
            window.location.reload();
        } else {
            window.location.replace('project.html');
        };
    };
};

function open_project(index) {
    if (projects != [] && projects != null && projects != undefined) {
        for (p of projects) {
            p.selected = false;
        };
    };

    projects[index].selected = true;
    window.localStorage.setItem('projects', JSON.stringify(projects));

    window.location.replace('project.html');
};

document.querySelector('.create-project').addEventListener('click', function (e) {
    const title = document.querySelector('#project-title').value.trim();
    const color = document.querySelector('#background-fill').value.trim();
    const fps = document.querySelector('#fps').value.trim();
    const drmttpp = document.querySelector('#drmttpp').checked;

    create_project(title, color, fps, drmttpp);
});

function delete_project(e, index) {
    if (projects[index]) {
        delete projects[index];
        projects = projects.filter(function (el) {
            return el != null;
        });
        window.localStorage.setItem('projects', JSON.stringify(projects));
        e.parentElement.parentElement.remove();
        refresh_modal();
    };

    projects = JSON.parse(window.localStorage.getItem('projects'));
};

function edit_project(project_id, title, fps) {
    projects[project_id].title = title;
    projects[project_id].fps = fps;
    window.localStorage.setItem('projects', JSON.stringify(projects));
};

function set_project_data_to_modal(id, title, fps) {
    const project_header_e = document.querySelector('#project-header-e');
    const title_e = document.querySelector('#project-title-e');
    const fps_e = document.querySelector('#fps-e');
    const edit_project_btn = document.querySelector('.edit-project');

    project_header_e.innerHTML = title;
    title_e.value = title;
    fps_e.value = fps;

    edit_project_btn.onclick = function () {
        edit_project(id, title_e.value.trim(), fps_e.value.trim());
        document.querySelector('#editProjectModal').style.display = "none";
        window.location.reload();
    };
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

document.querySelector('#metadescrition').content = returnTranslation('metadescrition');
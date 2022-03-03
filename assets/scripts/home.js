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

refresh_modal();

function refresh_modal() {
    const title = document.querySelector('#project-title');
    const color = document.querySelector('#background-fill');
    const fps = document.querySelector('#fps');
    const drmttpp = document.querySelector('#drmttpp');

    title.value = `${returnTranslation('my_project')} ${projects.length + 1}`;
    color.value = '#ffffff';
    fps.value = 5;
    drmttpp.checked = false;
    document.querySelector('#will_be_saved').innerText = `${returnTranslation('my_project')} ${projects.length + 1}`;

    document.querySelector('#project-title').oninput = (e) => {
        if (e.target.value.trim() == '' || e.target.value.trim() == null || e.target.value.trim() == undefined) {
            document.querySelector('#will_be_saved').innerText = `${returnTranslation('my_project')} ${projects.length + 1}`;
        } else {
            document.querySelector('#will_be_saved').innerText = getTitle(e.target.value.trim());
        };
    };
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
            document.getElementById('newProjectModal').style.display = 'none';
            refresh_modal()
            reset_projects();
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

var getTitle = (title) => {
    if (title.length > 50) {
        return title.slice(0, 55) + '...';
    } else {
        return title;
    };
};

var getProjectTitle = (title) => {
    if (title.length > 16) {
        return title.slice(0, 16) + '...';
    } else {
        return title;
    };
};

function delete_project(e, index) {
    if (projects[index]) {
        delete projects[index];
        projects = projects.filter(function (el) {
            return el != null;
        });
        window.localStorage.setItem('projects', JSON.stringify(projects));
        reset_projects();
        refresh_modal();
    };

    projects = JSON.parse(window.localStorage.getItem('projects'));
};

function edit_project(project_id, title, old_title, fps) {
    if (title == '' || title == null || title == undefined) {
        projects[project_id].title = old_title;
    } else {
        projects[project_id].title = title;
    };
    projects[project_id].fps = fps;
    window.localStorage.setItem('projects', JSON.stringify(projects));
};

function set_project_data_to_modal(id, title, fps) {
    const project_header_e = document.querySelector('#project-header-e');
    const title_e = document.querySelector('#project-title-e');
    const fps_e = document.querySelector('#fps-e');
    const edit_project_btn = document.querySelector('.edit-project');

    project_header_e.innerHTML = title;
    project_header_e.innerHTML = project_header_e.innerHTML.slice(0, 57);
    (project_header_e.innerHTML.length >= 57) ? project_header_e.innerHTML += '...' : null;
    title_e.value = title;
    fps_e.value = fps;
    document.querySelector('#will_be_saved-e').innerText = getTitle(title_e.value.trim());

    edit_project_btn.onclick = function () {
        edit_project(id, title_e.value.trim(), title, fps_e.value.trim());
        document.querySelector('#editProjectModal').style.display = "none";
        reset_projects();
    };

    document.querySelector('#project-title-e').oninput = (e) => {
        if (e.target.value.trim() == '' || e.target.value.trim() == null || e.target.value.trim() == undefined) {
            document.querySelector('#will_be_saved-e').innerText = getTitle(title);
        } else {
            document.querySelector('#will_be_saved-e').innerText = getTitle(e.target.value.trim());
        };
    };
};

function reset_projects() {
    let projects_wrapper = document.querySelectorAll('.projects-wrapper #prjs .project');

    projects_wrapper.forEach((prj) => {
        prj.remove();
    });

    for (var i = 0; i < projects.length; i++) {
        document.querySelector('.projects-wrapper #prjs').insertAdjacentHTML('beforeend', `<div class="project">
            <ul class="project-options">
                <li class="project-option" onclick="open_modal(document.querySelector('#editProjectModal')); set_project_data_to_modal(${i}, '${projects[i].title}', ${projects[i].fps})">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="white" class="bi bi-pencil-fill" viewBox="0 0 22 22">
                        <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                        </svg>
                        </li>
                        <li class="project-option" onclick="delete_project(this, ${i})"><p style="font-size: 28px; margin-top: -11px; text-align: center;">&times;</p></li>
                        </ul>
                        <div class="project-wrapper" onclick="open_project(${i})">
<img src="${projects[i].slides[0]}" alt="${projects[i].title}" class="project-thumbnail">
<h3 class="project-title">${getProjectTitle(projects[i].title)}</h3>
</div>
</div>`);
    };
};

document.querySelector('#metadescrition').content = returnTranslation('metadescrition');
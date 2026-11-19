import requests from "./requests.js";

// #region Data
const NO_IMAGE = "https://www.legrand.kz/modules/custom/legrand_ecat/assets/img/no-image.png";

const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const postCreateForm = document.getElementById("postCreateForm");

const loading = document.createElement("div");
loading.className = "alert alert-secondary";
loading.innerText = "Загрука...";

const screens = {
    index: document.getElementById("indexPage"),
    register: document.getElementById("registerPage"),
    login: document.getElementById("loginPage"),
    post: document.getElementById("postPage"),
    create: document.getElementById("createPostPage"),
    profile: document.getElementById("profilePage")
};
// #endregion

// #region API Helpers
function checkToken() {
    const login = document.getElementById("loginLink");
    const register = document.getElementById("registerLink");
    const logout = document.getElementById("logoutLink");
    const newPost = document.getElementById("newpostLink");
    const profile = document.getElementById("profileLink");

    if (localStorage.getItem("token") !== null) {
        login.hidden = true;
        register.hidden = true;
    } else {
        logout.hidden = true;
        newPost.hidden = true;
        profile.hidden = true;
    }
}

function setScreen(screen) {
    Object.values(screens).forEach(el => el.hidden = true);
    screens[screen].hidden = false;
}
// #endregion

// #region Helpers
const truncate = (str, maxLength) => {
    return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
};

function card(level, content, parent) {
    const card = document.createElement("div");
    card.className = `alert alert-${level}`;
    card.innerText = content;

    parent.prepend(card);
    setTimeout(() => {
        parent.removeChild(card);
    }, 6000);
}
// #endregion

// #region Renderers
async function renderIndex() {
    screens.index.innerHTML = ``;
    screens.index.append(loading);

    try {
        const posts = await requests.getAllPosts();
        let postcards = [];

        for (const post of posts) {
            const card = document.createElement("div");
            card.className = "col-12 col-sm-6 col-md-4 col-lg-3 mb-4";

            card.innerHTML = `
                <div class="card">
                    <img 
                        src="${post.image}" 
                        class="card-img-top" 
                        style="height: 150px; object-fit: cover;" 
                        alt="${post.name}" 
                        onerror="this.onerror=null; this.src='${NO_IMAGE}';"
                    >

                    <div class="card-body">
                        <div class="badge bg-success mb-3">${post.user}</div>
                        <h5 class="card-title">${truncate(post.name, 15)}</h5>
                        <p class="card-text">${truncate(post.text, 15)}</p>
                        <a href="#" class="btn btn-primary" onclick="renderPost(${post.id})">Читать пост</a>
                    </div>
                </div>
            `;

            postcards.push(card);
        }

        screens.index.innerHTML = `<div class="row row-cols-4"></div>`;
        screens.index.children[0].append(...postcards);
    } catch (err) {
        console.error(err);
    }
}

async function renderPost(id) {
    // reset previous contents
    setScreen("post");
    screens.post.innerHTML = ``;
    screens.post.append(loading);

    try {
        const metadata = await requests.getPostById(id);
        const element = document.createElement("div");

        const commentCards = [];
        for (const comment of metadata.comments) {
            const card = document.createElement("div");
            card.className = "card mb-3";

            console.log(comment);

            card.innerHTML = `
                <div class="card-body">
                    <div class="d-flex justify-content-between">
                        <h5 class="card-title">${comment.user}</h5>
                        <small class="card-text text-muted">${new Date(comment.created_at).toUTCString()}</small>
                    </div>
                    <p class="card-text">${comment.text}</p>
                </div>
            `;

            commentCards.push(card);
        }

        element.innerHTML = `
            <h2 class="mb-4">${metadata.name}</h2>
            <img 
                src="${metadata.image}" 
                alt="${metadata.name}" 
                style="max-width: 100%;"
                onerror="this.onerror=null; this.src='${NO_IMAGE}';"
            >
            <p>${metadata.text}</p>

            <h4 class="mt-3">Комментарии</h4>
            <div class="mb-4">
                <textarea rows="3" class="form-control" placeholder="Введите комментарий" id="postCommentCreate"></textarea>
                <button class="btn btn-success mt-2" onclick="handlePostCommentCreate(${metadata.id})">Отправить</button>
            </div>

            <div class="comments">
                
            </div>
        `;

        // set new contents
        screens.post.innerHTML = ``;
        element.querySelector(".comments").append(...commentCards);
        screens.post.appendChild(element);
    } catch (err) {
        console.err(err);
    }
}

async function handleRegisterRender(username, login, password) {
    try {
        const result = await requests.register(username, login, password);

        if (!result.success) {
            card("danger", "Что-то пошло не так!", screens.register);
        } else {
            card("success", "Регистрация прошла успешно!", screens.register);
        }
    } catch {
        //
    }
}

async function handleLoginRender(login, password) {
    try {
        const result = await requests.login(login, password);

        if (result.success) {
            window.location.href = "/html-api-task";
        } else {
            card("danger", "Что-то пошло не так!", screens.register);
        }
    } catch {
        //
    }
}

async function handlePostCreate(post) {
    try {
        const result = await requests.createPost(post);

        if (result.success) {
            card("success", "Пост был успешно создан!", screens.create);
        } else {
            card("danger", "Что-то пошло не так!", screens.create);
        }
    } catch {
        //
    }
}

async function handlePostDelete(id) {
    try {
        const result = await requests.deletePost(id);

        if (result.success) {
            await renderProfile();
            card("success", "Пост успешно удален!", screens.profile);
        } else {
            card("danger", "Что-то пошло не так!", screens.profile);
        }
    } catch {
        //
    }
}

async function handlePostCommentCreate(id) {
    const comment = document.getElementById("postCommentCreate").value;
    const result = await requests.createComment(id, comment);

    if (result.success) {
        await renderPost(id);
        card("success", "Комментарий опубликован успешно!", screens.post);
    } else {
        card("danger", "Что-то пошло не так!", screens.profile);
    }
}

async function renderProfile() {
    screens.profile.innerHTML = ``;
    screens.profile.append(loading);

    try {
        const posts = await requests.getOwnPosts();
        const postrows = [];

        console.log(posts);

        for (const post of posts) {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${post.id}</td>
                <td>${post.name}</td>
                <td>${new Date(post.created_at).toUTCString()}</td>

                <td>
                    <div>
                        <button type="button" class="btn btn-primary" onclick="renderPost(${post.id})">Перейти к посту</button>
                        <button type="button" class="btn btn-danger" onclick="handlePostDelete(${post.id})">Удалить пост</button>
                    </div>
                </td>
            `;

            postrows.push(row);
        }

        const content = document.createElement("div");
        content.innerHTML = `
            <h2 class="mb-4">Добро пожаловать, ${localStorage.getItem("username")}!</h2>

            <table class="table" id="postsTable">
                <tr>
                    <th>ID</th>
                    <th>Название поста</th>
                    <th>Дата создания</th>
                    <th>Действия</th>
                </tr>
            </table>
        `;

        screens.profile.innerHTML = ``;
        content.children[1].append(...postrows);
        screens.profile.append(content);
    } catch {
        //
    }
}
// #endregion

// #region Binds
window.setScreen = setScreen;
window.renderPost = renderPost;
window.renderIndex = renderIndex;
window.renderProfile = renderProfile;

window.logout = requests.logout;
window.handlePostDelete = handlePostDelete;
window.handlePostCommentCreate = handlePostCommentCreate;

registerForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    event.target.reset();

    handleRegisterRender(data.username, data.login, data.password);
});

loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    event.target.reset();

    handleLoginRender(data.login, data.password);
});

postCreateForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    event.target.reset();

    handlePostCreate(data);
});
// #endregion

// #region onMount
setScreen("index");
renderIndex();
checkToken();
// #endregion

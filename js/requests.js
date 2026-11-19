const BASE_URL = "https://kino.vippo.ru/api";

async function login(username, password) {
    const url = `${BASE_URL}/login`;
    const options = {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({
            login: username,
            password: password
        })
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("username", data.username);

            data.success = true;
            return data;
        } else {
            data.success = false;
            return data;
        }
    } catch (error) {
        console.log(error);
        return error;
    }
}

async function register(username, login, password) {
    const url = `${BASE_URL}/register`;
    const options = {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({
            login: login,
            password: password,
            name: username
        })
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        if (response.ok) {
            data.success = true;
            return data;
        } else {
            data.success = false;
            return data;
        }
    } catch (error) {
        console.error(error);
        return error;
    }
}

function logout() {
    localStorage.clear();
    window.location.href = "/html-api-task";
}

async function getAllPosts() {
    const url = `${BASE_URL}/post`;
    const options = {method: 'GET'};

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
}

async function searchPosts(query) {
    const url = `${BASE_URL}/post/search?q=${query}`;
    const options = {method: 'GET'};

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        return data;
    } catch (error) {
        console.error(error);
        return error;
    }
}

async function getPostsByFilter(filter) {
    const url = `${BASE_URL}/post?sort=${filter}`;
    const options = {method: 'GET'};

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        return data;
    } catch (error) {
        console.error(error);
        return error;
    }
}

async function getPostById(id) {
    const url = `${BASE_URL}/post/${id}`;
    const options = {method: 'GET'};

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        return data;
    } catch (error) {
        console.error(error);
        return error;
    }
}

async function getOwnPosts() {
    const url = `${BASE_URL}/my-post`;
    const options = {
        method: 'GET',
        headers: {authorization: `Bearer ${localStorage.getItem('token')}`},
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        return data;
    } catch (error) {
        console.error(error);
        return error;
    }
}

async function likeCheck(postId) {
    const url = `${BASE_URL}/post/${postId}/like`;
    const options = {
        method: 'GET',
        headers: {authorization: `Bearer ${localStorage.getItem('token')}`},
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        return data;
    } catch (error) {
        console.error(error);
        return error;
    }
}

async function likePost(postId) {
    const url = `${BASE_URL}/post/${postId}/like`;
    const options = {
        method: 'POST',
        headers: {authorization: `Bearer ${localStorage.getItem('token')}`},
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        if (response.ok) {
            data.success = true;
            return data;
        } else {
            data.success = false;
            return data;
        }
    } catch (error) {
        console.error(error);
        return error;
    }
}

async function createPost(post) {
    const url = `${BASE_URL}/post`;

    const form = new FormData();
    form.append('name', post.title);
    form.append('text', post.description);
    form.append('image', post.image);

    const options = {
        method: 'POST',
        headers: {authorization: `Bearer ${localStorage.getItem("token")}`},
    };

    options.body = form;

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        if (response.ok) {
            data.success = true;
            return data;
        } else {
            data.success = false;
            return data;
        }
    } catch (error) {
        console.error(error);
        return error;
    }
}

async function updatePost(post, postId) {
    const url = `${BASE_URL}/post/${postId}`;

    const form = new FormData();
    form.append('name', post.name);
    form.append('text', post.description);
    form.append('image', post.image);

    const options = {
        method: 'POST',
        headers: {authorization: `Bearer ${localStorage.getItem("token")}`},
    };

    options.body = form;

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        if (response.ok) {
            data.success = true;
            return data;
        } else {
            data.success = false;
            return data;
        }
    } catch (error) {
        console.error(error);
        return error;
    }
}

async function deletePost(postId) {
    const url = `${BASE_URL}/post/${postId}`;
    const options = {
        method: 'DELETE',
        headers: {authorization: `Bearer ${localStorage.getItem("token")}`},
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        if (response.ok) {
            return {success: true, data};
        } else {
            return {success: false, data};
        }
    } catch (error) {
        console.error(error);
        return error;
    }
}

async function createComment(postId, comment) {
    const url = `${BASE_URL}/post/${postId}/comment`;
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
            text: comment
        })
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        if (response.ok) {
            data.success = true;
            return data;
        } else {
            data.success = false;
            return data;
        }
    } catch (error) {
        console.error(error);
        return error;
    }
}

async function deleteComment(id) {
    const url = `${BASE_URL}/comment/${id}`;
    const options = {
        method: 'DELETE',
        headers: {authorization: `Bearer ${localStorage.getItem("token")}`},
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        if (response.ok) {
            data.success = true;
            return data;
        } else {
            data.success = false;
            return data;
        }
    } catch (error) {
        console.error(error);
        return error;
    }
}

export default {
    BASE_URL,
    login,
    register,
    logout,
    getAllPosts,
    getPostById,
    getOwnPosts,
    createPost,
    updatePost,
    deletePost,
    searchPosts,
    getPostsByFilter,
    createComment,
    deleteComment,
    likeCheck,
    likePost
}

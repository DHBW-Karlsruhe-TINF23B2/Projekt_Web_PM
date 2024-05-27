export function fetchDataFromAPI() {
    return fetch('http://localhost:8000/api/all');
}

export function createTodo(form) {
    const jsonData = JSON.stringify(Object.fromEntries(new FormData(form)));

    return fetch("http://localhost:8000/api/create", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: jsonData
    });
}

export function deleteTodo(id) {
    const jsonData = JSON.stringify(JSON.parse('{"id": '+id+'}'));
    return fetch("http://localhost:8000/api/delete", {
        method: "POST",
        headers: {'Content-Type' : 'application/json'},
        body: jsonData
    });
}

export function updateTodo(form) {
    const jsonData = JSON.stringify(Object.fromEntries(new FormData(form)));
    return fetch("http://localhost:8000/api/update", {
        method: "POST",
        headers: {'Content-Type' : 'application/json'},
        body: jsonData
    });
}

export function updateTodoFromJson(json) {
    const jsonData = JSON.stringify(JSON.parse(json));

    return fetch("http://localhost:8000/api/update", {
        method: "POST",
        headers: {'Content-Type' : 'application/json'},
        body: jsonData
    });
}

export function getTodo(id) {
    const jsonData = JSON.stringify(JSON.parse('{"id": '+id+'}'));
    return fetch("http://localhost:8000/api/get", {
        method: "POST",
        headers: {'Content-Type' : 'application/json'},
        body: jsonData
    });
}
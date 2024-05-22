import {deleteTodo} from "./call_backend.js";

const todos = document.querySelector("#todos");
const refreshBtn = document.querySelector("#refreshButton");

function fetchDataFromAPI() {
    fetch('http://localhost:8000/api/all')
        .then(received => received.json())
        .then(data => addDataToSide(data));
}


function addDataToSide(todosData) {
    for(const num in todosData) {
        const todo = todosData[num];

        const todoDiv = document.createElement("div");
        todoDiv.classList.add("todo");

        const title = document.createElement("h3");
        title.classList.add("todoTitle");
        title.innerText = todo["title"];

        const description = document.createElement("p");
        description.classList.add("todoDescription");
        description.innerText = todo["description"];

        const header = document.createElement("div");
        header.classList.add("headerDiv");

        const titleDiv = document.createElement("div");
        titleDiv.classList.add("titleDiv");

        const btnDiv = document.createElement("div");
        btnDiv.classList.add("btnDiv");

        const delBtn = document.createElement("button");
        delBtn.classList.add("delBtn");
        delBtn.innerText="X";
        delBtn.addEventListener("click",() => deleteTodo(todo["id"])
            .then(res => console.log(res.status)));
        delBtn.addEventListener("click", () => window.location.reload());

        const editBtn = document.createElement("button");
        editBtn.classList.add("editBtn");
        editBtn.innerText="E";

        todoDiv.append(header);
        titleDiv.append(title);
        header.append(titleDiv);
        btnDiv.append(delBtn);
        btnDiv.append(editBtn);
        header.append(btnDiv);

        todoDiv.append(description);

        todos.append(todoDiv);
    }
}

refreshBtn.addEventListener('click', () =>  {
    todos.innerHTML = "";
   fetchDataFromAPI();
});

fetchDataFromAPI();
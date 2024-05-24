import {deleteTodo, createTodo, fetchDataFromAPI, updateTodo, getTodo} from "./call_backend.js";

const todos = document.querySelector("#todos");
const refreshBtn = document.querySelector("#refreshButton");
const creationForm = document.querySelector("#creationForm");
const creationPopUp= document.querySelector("#creationPopUp");
const createButton = document.querySelector("#createButton");
const closePopUpBtn = document.querySelector("#closePopUpBtn");

function refreshTodos(){
    todos.innerHTML = "";
    fetchDataFromAPI().then(received => received.json())
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
        header.classList.add("headerDivToDo");

        const titleDiv = document.createElement("div");
        titleDiv.classList.add("titleDivToDo");

        const btnDiv = document.createElement("div");
        btnDiv.classList.add("btnDivToDo");

        const delBtn = document.createElement("button");
        delBtn.classList.add("delBtnToDo");
        delBtn.innerText="X";
        delBtn.addEventListener("click",() => {
            deleteTodo(todo["id"]).then(res => {
                    refreshTodos();
                });
        });

        const editBtn = document.createElement("button");
        editBtn.classList.add("editBtnToDo");
        editBtn.innerText="E";
        editBtn.addEventListener("click", (e) =>{
            e.preventDefault();
            creationForm.action = "http://localhost:8000/api/update";
            document.getElementById("toDoId").value = todo["id"];
            document.getElementById("title").value = todo["title"];
            document.getElementById("description").value = todo["description"];
            creationPopUp.classList.add("enabled");
        });

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

creationForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    if (creationForm.action === "http://localhost:8000/api/create") {
        createTodo(creationForm).then(r => {
            refreshTodos();
            creationForm.reset();
        });
    } else if (creationForm.action === "http://localhost:8000/api/update"){
        updateTodo(creationForm).then(r => {
            refreshTodos();
            creationForm.reset();
        });
    }
    creationPopUp.classList.remove("enabled");
});

closePopUpBtn.addEventListener('click', ()=>{
    creationPopUp.classList.remove("enabled");
})

createButton.addEventListener("click", () =>{
    creationForm.reset();
    creationForm.action = "http://localhost:8000/api/create";
    creationPopUp.classList.add("enabled");
});

refreshBtn.addEventListener('click', () =>  {
    refreshTodos();
});

refreshTodos();
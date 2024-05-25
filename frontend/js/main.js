import {deleteTodo, createTodo, fetchDataFromAPI, updateTodo, getTodo} from "./call_backend.js";

const todos = document.querySelector("#todos");
const refreshBtn = document.querySelector("#refreshButton");
const creationForm = document.querySelector("#creationForm");
const creationPopUp= document.querySelector("#creationPopUp");
const createButton = document.querySelector("#createButton");
const closePopUpBtn = document.querySelector("#closePopUpBtn");
const radioBtnNo = document.querySelector("#nein");

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

        const checkboxDiv = document.createElement("div");
        checkboxDiv.classList.add("checkboxDiv");

        const checkBox = document.createElement("input");
        checkBox.type = "checkbox";
        checkBox.id = todo["id"];
        checkBox.name = todo["name"];
        checkBox.classList.add("checkbox");
        checkBox.addEventListener("change", () => {
            todoDiv.classList.toggle("checked");
            // update todo
        })

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
        delBtn.innerHTML="<img id='deleteIcon' src='../img/trashCan_white.png' alt='edit' style='width: 80%'>";
        delBtn.addEventListener("click",() => {
            deleteTodo(todo["id"]).then(res => {
                    refreshTodos();
                });
        });

        const editBtn = document.createElement("button");
        editBtn.classList.add("editBtnToDo");
        editBtn.innerHTML="<img id='editIcon' src='../img/edit_white.png' alt='edit'>";
        editBtn.addEventListener("click", (e) =>{
            e.preventDefault();
            // get/respect status of radio button
            creationForm.action = "http://localhost:8000/api/update";
            document.getElementById("popUpH2").innerHTML = "ToDo <span>updaten</span>"
            document.getElementById("toDoId").value = todo["id"];
            document.getElementById("title").value = todo["title"];
            document.getElementById("description").value = todo["description"];
            document.getElementById("submit").value = "Updaten";
            creationPopUp.classList.add("enabled");
            document.getElementById("title").focus();
        });

        todoDiv.append(checkboxDiv);
        checkboxDiv.append(checkBox);
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
    radioBtnNo.checked = true;
    creationForm.action = "http://localhost:8000/api/create";
    creationPopUp.classList.add("enabled");
    document.getElementById("popUpH2").innerHTML = "ToDo <span>erstellen</span>"
    document.getElementById("submit").value = "Erstellen";
    document.getElementById("title").focus();
});

refreshBtn.addEventListener('click', () =>  {
    refreshTodos();
});

refreshTodos();
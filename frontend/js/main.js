import {
    deleteTodo,
    createTodo,
    fetchDataFromAPI,
    updateTodo,
    updateTodoFromJson
} from "./call_backend.js";

const todos = document.querySelector("#todos");
const refreshBtn = document.querySelector("#refreshButton");
const creationForm = document.querySelector("#creationForm");
const creationPopUp= document.querySelector("#creationPopUp");
const createButton = document.querySelector("#createButton");
const closePopUpBtn = document.querySelector("#closePopUpBtn");
const radioBtnNo = document.querySelector("#nein");
const radioBtnYes = document.querySelector("#ja");
const todoLoader = document.querySelector("#todoLoader");
const actionInfo = document.querySelector("#actionInfo");
const submitForm = document.querySelector("#submit");

Date.prototype.addHours= function(h){
    this.setHours(this.getHours()+(h+2));
    return this;
}

function refreshTodos(){
    todos.innerHTML = "<p class='fetch__trying'>Aktualisiere TODOs...</p>";
    todoLoader.classList.remove("todo__loader--hidden");
    fetchDataFromAPI().then(received => received.json())
        .then(data => {
            todos.innerHTML = "";
            todoLoader.classList.add("todo__loader--hidden");
            addDataToSide(data);
        }).catch((reason) => {
            todoLoader.classList.add("todo__loader--hidden");
            todos.innerHTML = "<div class='fetch__error'><p class='fetch__error__title'>Ein unerwarteter Fehler ist aufgetreten.</p><p class='fetch__error__reason'>" + reason+ "</p></div>";
    });
}

function createDeadlineSpan(date, todo, deadline) {
    let currentDate = new Date();
    let infoTime = currentDate.toLocaleString("de-DE", {hour:'2-digit', minute:'2-digit'});
    currentDate = currentDate.toISOString().slice(0, 16);
    if (date.toISOString().slice(0, 16) < currentDate && todo["done"] === 0) {
        const option = {weekday: 'short', day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit'};
        const formatDate = date.toLocaleDateString("de-DE", option);
        deadline.innerHTML = "<span class='past todoDate'>" + "Überfällig seit: " + formatDate.slice(0,5) +" "+ formatDate.slice(5,13)+ " um " + formatDate.slice(14) + "</span>";
    } else if (date.toISOString().slice(0, 16) == currentDate && todo["done"] === 0){
        deadline.innerHTML = "<span class='now todoDate'>" + infoTime + " - ToDo ist jetzt fällig!" + "</span>";
    } else if (todo["done"] === 1) {
        deadline.innerHTML = "<span class='done todoDate'>" + "Erledigt" + "</span>";
    } else {
        const option = {
            weekday: 'short',
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        const formatDate = date.toLocaleTimeString("de-DE", option);
        deadline.innerHTML = "<span class='todoDate'>" + "Fällig am: " + formatDate + "</span>";
    }
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
        checkBox.checked = todo["done"] === 1;
        if(todo["done"] === 1) todoDiv.classList.toggle("checked");
        checkBox.addEventListener("change", (e) => {
            const done = checkBox.checked ? "Ja" : "Nein";
            const json = '{"id":"' + todo["id"] + '", "title": "' + todo["title"] + '", "description": "' + todo["description"] + '", "done": "' + done + '", "deadline": "' + todo["deadline"] + '"}';
            updateTodoFromJson(json).then(res=> refreshTodos());
        });

        const title = document.createElement("h3");
        title.classList.add("todoTitle");
        title.innerText = todo["title"];

        const description = document.createElement("p");
        description.classList.add("todoDescription");
        description.innerText = todo["description"];

        const deadline = document.createElement("div");
        deadline.classList.add("todoDeadline");
        const date = new Date(todo["deadline"]);
        createDeadlineSpan(date, todo, deadline);

        const header = document.createElement("div");
        header.classList.add("headerDivToDo");

        const titleDiv = document.createElement("div");
        titleDiv.classList.add("titleDivToDo");

        const btnDiv = document.createElement("div");
        btnDiv.classList.add("btnDivToDo");

        const delBtn = document.createElement("button");
        delBtn.classList.add("delBtnToDo");
        delBtn.innerHTML="<img class='deleteIcon' src='../img/trashCan_white.png' alt='edit' style='width: 80%'>";
        delBtn.addEventListener("click",() => {
            deleteTodo(todo["id"]).then(res => {
                    refreshTodos();
                });
        });

        const editBtn = document.createElement("button");
        editBtn.classList.add("editBtnToDo");
        editBtn.innerHTML="<img class='editIcon' src='../img/edit_white.png' alt='edit'>";
        editBtn.addEventListener("click", (e) =>{
            e.preventDefault();
            if(todo["done"] === 1) {
                radioBtnYes.checked = true;
            } else {
                radioBtnNo.checked = true;
            }
            creationForm.action = "http://localhost:8000/api/update";
            document.getElementById("popUpH2").innerHTML = "ToDo <span>updaten</span>"
            document.getElementById("toDoId").value = todo["id"];
            document.getElementById("title").value = todo["title"];
            document.getElementById("description").value = todo["description"];
            document.getElementById("deadline").value = todo["deadline"];
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
        todoDiv.append(deadline);

        todos.append(todoDiv);
    }
}

creationForm.addEventListener('submit', (e)=>{
    e.preventDefault();

    submitForm.value = "Loading...";
    submitForm.disabled = true;

    if (creationForm.action === "http://localhost:8000/api/create") {
        createTodo(creationForm).then(r => {

            if(r.status === 200) {
                refreshTodos();
                creationForm.reset();
                submitForm.value = "Erstellen";
                submitForm.disabled = false;
                actionInfo.innerText = "Neues Todo wurde angelegt.";
                actionInfo.classList.remove("action__info--hidden");
            } else {
                r.json().then(value => {
                    submitForm.value = "Erstellen";
                    submitForm.disabled = false;
                    actionInfo.innerHTML = "Fehler beim anlegen! <br>" + value.message;
                    actionInfo.classList.remove("action__info--hidden");
                });
            }
        }).catch(reason => {
            submitForm.value = "Erstellen";
            submitForm.disabled = false;
            actionInfo.innerHTML = "Fehler beim anlegen! <br>" + reason.message;
            actionInfo.classList.remove("action__info--hidden");
        });
    } else if (creationForm.action === "http://localhost:8000/api/update") {

        updateTodo(creationForm).then(r => {
            if(r.status === 200) {
                refreshTodos();
                submitForm.value = "Updaten";
                submitForm.disabled = false;
                actionInfo.innerText = "Todo wurde aktualisiert.";
                actionInfo.classList.remove("action__info--hidden");
            } else {
                r.json().then(value => {
                    submitForm.value = "Updaten";
                    submitForm.disabled = false;
                    actionInfo.innerHTML = "Fehler beim aktualisieren! <br>" + value.message;
                    actionInfo.classList.remove("action__info--hidden");
                });
            }
        }).catch(reason => {
            submitForm.value = "Updaten";
            submitForm.disabled = false;
            actionInfo.innerHTML = "Fehler beim aktualisieren! <br>" + reason.message;
            actionInfo.classList.remove("action__info--hidden");
        });;
    }
});

closePopUpBtn.addEventListener('click', ()=>{
    creationPopUp.classList.remove("enabled");
    actionInfo.classList.add("action__info--hidden");
});

createButton.addEventListener("click", () =>{
    creationForm.reset();
    radioBtnNo.checked = true;
    creationForm.action = "http://localhost:8000/api/create";
    creationPopUp.classList.add("enabled");
    document.getElementById("popUpH2").innerHTML = "ToDo <span>erstellen</span>"
    document.getElementById("submit").value = "Erstellen";
    let date = new Date().addHours(3);
    document.getElementById("deadline").value = date.toISOString().slice(0,16);
    document.getElementById("title").focus();
});

refreshBtn.addEventListener('click', () =>  {
    refreshTodos();
});

function refreshTodosEveryMin() {
    let time = new Date(),
        secondsRemaining = (60 - time.getSeconds()) * 1000;

    setTimeout(function () {
        setInterval(refreshTodos, 60000);
    }, secondsRemaining);
}

refreshTodos();
refreshTodosEveryMin();

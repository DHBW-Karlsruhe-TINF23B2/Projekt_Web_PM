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
        title.classList.add("todo__title");
        title.innerText = todo["title"];

        const description = document.createElement("p");
        description.classList.add("todo__description");
        description.innerText = todo["description"];

        todoDiv.append(title);
        todoDiv.append(description);
        todos.append(todoDiv);
    }
}

refreshBtn.addEventListener('click', () => {
    todos.innerHTML = "";
   fetchDataFromAPI();
});

fetchDataFromAPI();
class Todo {
  constructor(id, itemTitle, status, description) {
    this.id = id;
    this.itemTitle = itemTitle;
    this.status = status;
    this.description = description;
  }
}

class TodoList {
  constructor() {
    this.todoList = [];
  }

  addTodo(todo) {
    this.todoList.push(todo);
    this.renderTodo();
  }

  getTodo(id) {
    this.todoList.forEach((todo) => {
      if (todo.id === id) {
        const form = new Form({
          id: todo.id,
          itemTitle: todo.itemTitle,
          status: todo.status,
          description: todo.description,
          mode: "edit",
        });

        form.renderForm();
        form.showForm();
      }
    });
  }

  removeTodo(id) {
    this.todoList.forEach((todo, index) => {
      if (todo.id === id) {
        this.todoList.splice(index, 1);
      }
    });

    this.renderTodo();
  }

  editTodo(id, { itemTitle, status, description } = {}) {
    this.todoList.forEach((todo) => {
      if (todo.id === id) {
        todo.itemTitle = itemTitle;
        todo.status = status;
        todo.description = description;
      }

      this.renderTodo();
    });
  }

  renderTodo() {
    const list = document.querySelectorAll(".list");
    const status = ["backlog", "ongoing", "completed"];

    list.forEach((item, index) => {
      const todos = this.todoList
        .map((todo) => {
          if (todo.status === status[index]) {
            return `
            <div onclick="todoList.getTodo(${todo.id})" id="todo-${todo.id}" class="item">
              <div class="circle circle--${status[index]}"></div>
              <p class="content">${todo.itemTitle}</p>
              <div onclick="todoList.removeTodo(${todo.id})" class="delete">x</div>
            </div>
            `;
          }
        })
        .join("")
        .replace(",", "");

      item.innerHTML = todos;
    });
  }
}

class Form {
  constructor({ id = Date.now(), itemTitle, status, description, mode } = {}) {
    this.id = id;
    this.itemTitle = itemTitle;
    this.status = status;
    this.description = description;
    this.mode = mode;
  }

  #bindFormEvent() {
    // bind close button
    const close = document.querySelector("#item-form .close");

    close.addEventListener("click", () => {
      this.hideForm();
    });

    // bind submit button
    const submit = document.querySelector("#item-form .btn");
    submit.addEventListener("click", (e) => {
      e.preventDefault();
      const title = document.querySelector("#title");
      const status = document.querySelector("#status");
      const description = document.querySelector("#description");

      if (this.mode === "new") {
        const todo = new Todo(
          this.id,
          title.value,
          status.value,
          description.value
        );

        todoList.addTodo(todo);
      } else {
        todoList.editTodo(this.id, {
          itemTitle: title.value,
          status: status.value,
          description: description.value,
        });
      }

      this.hideForm();
    });
  }

  renderForm() {
    const itemForm = document.querySelector("#item-form");

    itemForm.innerHTML = `<div class="header">
            <h2>增加/變更 Item</h2>
            <div class="close">x</div>
        </div>
      <form class="form" action="">
        <div class="title-container">
            <p>名稱</p>
            <input name="title" type="text" id="title" value="${
              this.itemTitle
            }"/>
        </div>
        <div class="status-container">
            <p>狀態</p>
            <select name="status" id="status">
                <option value="backlog" ${
                  this.status === "backlog" ? "selected" : null
                }>backlog
                <option value="ongoing" ${
                  this.status === "ongoing" ? "selected" : null
                }>ongoing
                <option value="completed" ${
                  this.status === "completed" ? "selected" : null
                }>completed
            </select>
          </option>
        </div>
        <div class="description-container">
            <p>備註</p>
            <textarea name="description" id="description">${
              this.description
            }</textarea>
        </div>
        <button class="btn">送出</button>
      </form>`;

    this.#bindFormEvent();
  }

  hideForm() {
    const itemForm = document.querySelector("#item-form");
    const containerShadow = document.querySelector("#container-shadow");

    itemForm.classList.remove("item-form--active");
    containerShadow.classList.remove("container-shadow--focus");

    containerShadow.classList.add("container-shadow--disabled");
    itemForm.classList.add("item-form--disabled");
  }

  showForm() {
    const itemForm = document.querySelector("#item-form");
    const containerShadow = document.querySelector("#container-shadow");

    containerShadow.classList.remove("container-shadow--disabled");
    itemForm.classList.remove("item-form--disabled");

    itemForm.classList.add("item-form--active");
    containerShadow.classList.add("container-shadow--focus");
  }
}

const addItem = document.querySelectorAll(".add-item");
const todoList = new TodoList();

addItem.forEach((item, index) => {
  const status = ["backlog", "ongoing", "completed"];

  item.addEventListener("click", () => {
    const form = new Form({
      itemTitle: "新待辦標題",
      status: status[index],
      description: "新待辦敘述，只是一個簡單的敘述，真的很簡單的敘述而已",
      mode: "new",
    });

    form.renderForm();
    form.showForm();
  });
});

(function () {
    //Globals
    const toDoList = document.getElementById('todo-list')
    const userSelect = document.getElementById('user-todo')
    const form = document.querySelector('form')
    let toDos = []
    let users = []


// Attach Events

    document.addEventListener('DOMContentLoaded', initApp)
    form.addEventListener('submit', handleSubmit)


// Basic Logic

    function getUserName(userId) {
        const user = users.find((u) => u.id === userId)
        return user.name
    }

    function printToDo({id, userId, title, completed}) {
        const li = document.createElement('li')
        li.className = 'todo-item'
        li.dataset.id = id
        li.innerHTML = `<span>${title} <i>by</i> <b>${getUserName(userId)}<b/></span>`

        const status = document.createElement('input')
        status.type = 'checkbox'
        status.checked = completed
        status.addEventListener('change', handleToDoChange)

        const close = document.createElement('span')
        close.innerHTML = '&times;'
        close.className ='close'
        close.addEventListener('click', handleClose)

        li.prepend(status)
        li.append(close)

        toDoList.prepend(li)
    }

    function createUserOption(user) {
        const option = document.createElement('option')
        option.value = user.id
        option.innerText = user.name

        userSelect.append(option)
    }

    function removeToDo(todoId) {
        toDos = toDos.filter((item) => item.id !== todoId)

        const todo = toDoList.querySelector(`[data-id="${todoId}"]`)
        todo.querySelector('input').removeEventListener('change', handleToDoChange)
        todo.querySelector('.close').removeEventListener('click', handleClose)

        todo.remove()
    }

    function alertError(error) {
        alert(error.message)
    }

// Event

    function initApp() {
        Promise.all([getAllToDos(), getAllUsers()]).then((values) => {
            [toDos, users] = values

            toDos.forEach((toDo) =>  printToDo(toDo))
            users.forEach((user) => createUserOption(user))
        })
    }

    function handleSubmit(e) {
        e.preventDefault()

        createToDo({
            "userId": Number(form.user.value),
            "title": form.todo.value,
            "completed": false
        })
    }

    function handleToDoChange() {
        const toDoId = this.parentElement.dataset.id
        const completed = this.checked

        toggleToDoComplete(toDoId, completed)
    }

    function handleClose() {
        const toDoId = this.parentElement.dataset.id
        deleteToDo(toDoId)
    }


// Async

    async function getAllToDos() {

        try {
            const resp = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=15')
            const data = await resp.json()

            return data
        } catch(error) {
            alertError(error)
        }
    }

    async function getAllUsers() {
        try {
            const resp = await fetch('https://jsonplaceholder.typicode.com/users?_limit=15')
            const data = await resp.json()

            return data
        } catch (error) {
            alertError(error)
        }
    }

    async function createToDo(todo) {

        try {
            const resp = await fetch('https://jsonplaceholder.typicode.com/todos', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                },
                body: JSON.stringify(todo)
            })

            const newToDo = await resp.json()

            printToDo(newToDo)
        } catch (error) {
            alertError(error)
        }
    }

    async function toggleToDoComplete(toDoId, completed) {

        try {
            const resp = await fetch(`https://jsonplaceholder.typicode.com/todos/${toDoId}`, {
                method: 'PATCH',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                },
                body: JSON.stringify({
                    completed: completed
                })
            })

            if(!resp.ok) {
                throw new Error('Failed to connect with server')
            }
        } catch (error) {
            alertError(error)
        }
    }

    async function deleteToDo(toDoId) {
        try {
            const resp = await fetch(`https://jsonplaceholder.typicode.com/todos/${toDoId}`, {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                }
            })

            if(resp.ok) {
                removeToDo(toDoId)
            } else {
                throw new Error('Failed to connect with server')
            }
        } catch (error) {
            alertError(error)
        }
    }
})();



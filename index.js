const createTaskBtn = document.querySelectorAll('.create-task');
const backgroundModal = document.querySelector('.modal__background');
const btnModalClose = document.querySelector('.modal__window-close')
const btnCancelModal = document.querySelector('.modal__button-cancel');
const form = document.querySelector('#form');
const tasksList = document.querySelector('.list-group');
const btnCreateTaskMain = document.querySelector('.create-task-main')
const nightThemeBtn = document.querySelector('.night-theme-btn')

const openSettingMenuBtn = document.querySelector('.setting-btn');
const settingMenu = document.querySelector('.setting__menu');
const closeSettingMenuBtn = document.querySelector('.close__setting-btn')

const editingBlock = document.querySelector('.editing__container')
const cancelEditBtn = document.querySelector('.edit-form__cancel-btn')

const taskCounter = document.querySelector('.block-task-counter');



let tasks = []

if(localStorage.getItem('tasks')){
    tasks = JSON.parse(localStorage.getItem('tasks'))
    countCase()
}
tasks.forEach(function(task){
    renderTask(task)
})

checkEmptyList()

createTaskBtn.forEach(item => {
    item.addEventListener('click', openModal)
})

tasksList.addEventListener('click', createTask)
function createTask(event){
    if(event.target.dataset.action === 'create'){
        openModal()
    }

}

function openModal(){
    backgroundModal.classList.add('open')
}
const theme = localStorage.getItem('theme');
if(theme){
    document.body.classList.add(theme)
}



function openSettingMenu() {
    settingMenu.classList.add('open')
}
function closeSettingMenu() {
    settingMenu.classList.remove('open')
}

closeSettingMenuBtn.addEventListener('click', function(){
    closeSettingMenu()
})

openSettingMenuBtn.onclick = openSettingMenu;


window.addEventListener('keydown', (e) => {
    if(e.key === 'Escape'){
        closeSettingMenu()
    }
})






nightThemeBtn.addEventListener('click', function(){
    document.body.classList.toggle('night-theme')

    const theme = localStorage.getItem('theme')
    if(theme === 'night-theme'){
        localStorage.setItem('theme', '')
    }else{
        localStorage.setItem('theme', 'night-theme')
    }
})

btnModalClose.addEventListener('click', closeModal);
btnCancelModal.addEventListener('click', cancelModal);

function cancelModal() {
    backgroundModal.classList.remove('open')
    delteValidation()
}
function closeModal() {
    backgroundModal.classList.remove('open')
    delteValidation()
}

function reset() {
    let radioForm = document.querySelectorAll('.form__radio')
    for(let radio of radioForm){
        radio.checked = false
    }
    document.querySelector('.form-input').value = '';
    document.querySelector('.form-textarea').value = '';
    document.querySelector('.form-input-color').value = '#8B008B';
    backgroundModal.classList.remove('open')
}   

tasksList.addEventListener('click', deleteTask);
tasksList.addEventListener('click', doneTask);
tasksList.addEventListener('click', editTask)

function deleteTask(event){
    if(event.target.dataset.action !== 'delete'){
        return
    }

    const parentNode = event.target.closest('.list-group-item')
     // метод closest ищет родителя элемента

    // определение id задачи
    const id = Number (parentNode.id)

    tasks = tasks.filter(function(task){
        if (task.id === id){
            return false
        }else{
            return true
        }
    })

    saveToLS()
    // удаление заадчи из разметки
    parentNode.remove()

    checkEmptyList()
}


function openEditWindow() {
    editingBlock.classList.add('open')

    cancelEditBtn.addEventListener('click', function(){
        editingBlock.classList.remove('open')
    })
}


function editTask(event){
    if(event.target.dataset.action === 'edit'){
        openEditWindow()
        const parentNode = event.target.closest('.list-group-item')
    }
}

function doneTask(event) {
    if(event.target.dataset.action === 'done'){
        const parentNode = event.target.closest('.list-group-item')

        const id = Number(parentNode.id);

        const task = tasks.find(function(task){
            if(task.id === id){
                return true
            }
        })
        // task.done = обратное значение от task.done (done: true)
        task.done = !task.done

        
        const taskTitle = parentNode.querySelector('.note-title')
        const taskDescription = parentNode.querySelector('.note-description')
        const taskPriority = parentNode.querySelector('.note-priority')

        taskTitle.classList.add('note-title--done')
        taskDescription.classList.add('note-description--done')
        taskPriority.classList.add('note-priority--done')

       
    }

    saveToLS()
}





form.addEventListener('submit', addTask)

function addTask(e){
    e.preventDefault()

    // переменные формы
    let inputForm = document.querySelector('.form-input')
    let textareaForm = document.querySelector('.form-textarea')
    let colorForm = document.querySelector('.form-input-color')
    let radio = document.querySelectorAll('.form__radio')
    let radioBlock = document.querySelector('.modal__form-radio')
    let date = new Date().toLocaleString()

    let priority

    radio.forEach(item => {
        if(item.checked){
            priority = item.value
        }
    })

    newTask = {
        title: inputForm.value,
        description: textareaForm.value,
        color: colorForm.value,
        priority,
        date,
        done: false,
        id: Date.now()
    }
    console.log(newTask)
    
    
    if(inputForm.value.length === 0){
        inputForm.classList.add('error')
        return false
    }else{
        inputForm.classList.remove('error')
    }

    if(textareaForm.value.length === 0){
        textareaForm.classList.add('error')
        return false
    }else{
        textareaForm.classList.remove('error')
    }

    if(radio.length > 0){
        let checked = false;
        radio.forEach(item => {
            if (item.checked){
                checked = true
            }
        })
        if(!checked){
            radioBlock.classList.add('error')
            return false
        }else{
            radioBlock.classList.remove('error')
        }
    }

    tasks.push(newTask)
    reset()
    renderTask(newTask)
    saveToLS()
    checkEmptyList()
    return true;    
}
  
function countCase() {
    let totalTasks = document.querySelector('.total')
    let completedTasks = document.querySelector('.completed')
    completedTasks
    taskCounter.classList.add('open')
    totalTasks.textContent = tasks.length;
    saveToLS()
}

function reset() {
    let radioForm = document.querySelectorAll('.form__radio')
    for(let radio of radioForm){
        radio.checked = false
    }
    document.querySelector('.form-input').value = '';
    document.querySelector('.form-textarea').value = '';
    document.querySelector('.form-input-color').value = '#8B008B';
    backgroundModal.classList.remove('open')
}

function saveToLS(){
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask(task) {
    const cssClassTitle = task.done ? "note-title note-title--done" : "note-title"
    const cssClassDescription = task.done ? "note-priority note-priority--done" : "note-priority"
    const cssClassPriopity = task.done ? "note-description note-description--done" : "note-description"

    const taskHTML = 
    `
    <li id="${task.id}" class="list-group-item">
                    <div class="note">
                        <span class="${cssClassTitle}" >${task.title}</span>
                        <span class="${cssClassDescription}">${task.description}</span>
                        <span class="${cssClassPriopity}">${task.priority}</span>
                    </div>
                    <div class="note-btn">
                        <span>${task.date}</span>
                        <button class="btn-done" type="button" data-action ='done'>&check;</button>
                        <button class="btn-delete" type="button" data-action ='delete'>&times;</button>
                        <button class="btn-edit" type="button" data-action ='edit'>&#9998;</button>
                    </div>
                </li>

    `
    tasksList.insertAdjacentHTML('beforeend', taskHTML)
}

function checkEmptyList() {
    if(tasks.length === 0){
        const emptyListHTML = 
        `
        <li id="emptyList" class="empty-list">
                    <img src="icons/empty/sticky-note.png" alt="empty">
                    <h1 class="empty-list-title">У вас нет ни одной задачи. Может создадим?</h1>
                    <button class="create-task create-task-main" data-action ='create'  id="createTask">Создать задачу</button>
                </li>
        `
        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML)
        taskCounter.classList.remove('open')
    }

    if(tasks.length > 0){
        const emptyListEl = document.querySelector('.empty-list');
        emptyListEl ? emptyListEl.remove() : null 
        countCase()
    }
}

function delteValidation(){
    let inputForm = document.querySelector('.form-input')
    let textareaForm = document.querySelector('.form-textarea')
    let radioBlock = document.querySelector('.modal__form-radio')
    inputForm.classList.remove('error')
    textareaForm.classList.remove('error')
    radioBlock.classList.remove('error')
}

//закрытие модалки при нажатии на esc
window.addEventListener('keydown', (e) => {
    if(e.key === 'Escape'){
        reset()
        delteValidation()
    }
})

//зыкрытие модалки при нажатии вне модалки
window.onclick = function(e){
    if(e.target === backgroundModal){
        reset()
        delteValidation()
    }
}


// const cssClassTitle = task.done ? "note-title note-title--done" : "note-title"
// const cssClassDescription = task.done ? "note-priority note-priority--done" : "note-priority"
// const cssClassPriopity = task.done ? "note-description note-description--done" : "note-description"

// let tasks = []

// if(localStorage.getItem('tasks')){
//     tasks = JSON.parse(localStorage.getItem('tasks'))
// }

// tasks.forEach(function(task){
//     renderTask(task)
// })


// createTaskBtn.forEach(elem => {
//     elem.addEventListener('click', openModal)
// })

// function openModal() {
//     backgroundModal.classList.add('open')
// }


// btnModalClose.addEventListener('click', closeModal)
// btnCancelModal.addEventListener('click', cancelModal)

// function closeModal() {
//     reset()
// }

// function cancelModal() {
//     reset()
// }



// form.addEventListener('submit', addTask)

// function addTask(e) {
//     e.preventDefault()

//     // переменные формы
//     let inputForm = document.querySelector('.form-input')
//     let textareaForm = document.querySelector('.form-textarea')
//     let colorForm = document.querySelector('.form-input-color')
//     let radio = document.querySelectorAll('.form__radio')
//     let date = new Date().toLocaleString()

//     radio.forEach(item => {
//         if(item.checked){
//             priority = item.value
//         }
//     })

//     const newTask = {
//         title: inputForm.value,
//         descroption: textareaForm.value,
//         color: colorForm.value,
//         priority,
//         date,
//         done: false,
//         id: Date.now(),
//     }

//     tasks.push(newTask)
//     saveToLS()
    
//     renderTask(newTask)
//     reset()
   
//     checkEmptyList()
// }

// function reset() {
//     let radioForm = document.querySelectorAll('.form__radio')
//     for(let radio of radioForm){
//         radio.checked = false
//     }
//     document.querySelector('.form-input').value = '';
//     document.querySelector('.form-textarea').value = '';
//     document.querySelector('.form-input-color').value = '#8B008B';
//     backgroundModal.classList.remove('open')
// }

// function checkEmptyList() {
//     console.log(tasks.length)
//     if(tasks.length === 0){
//         const emptyListHTML = `
//         <li id="emptyList" class="empty-list">
//                     <img src="icons/empty/sticky-note.png" alt="empty">
//                     <h1 class="empty-list-title">У вас нет ни одной задачи. Может создадим?</h1>
//                     <button class="create-task create-task-main" id="createTask">Создать задачу</button>
//                 </li>
//         `
//         tasksList.insertAdjacentHTML('afterbegin',emptyListHTML)
//     }

//     if(tasks.length > 0){
//         const emptyListElement = document.querySelector('.empty-list');
//         emptyListElement ? emptyListElement.remove() : null
//     }
// }


// function saveToLS(){
//     localStorage.setItem('tasks', JSON.stringify(tasks))
// }



// function renderTask(task) { 
//     const cssClass = task.done ? "note-title note-title--done" : "note-title"

//     const taskHTML = `
//     <li id ='${task.id}' class="list-group-item">
//                     <div class="note">
//                         <span class="${cssClass}">${task.title}</span>
//                         <span class="note-description">${task.descroption}</span>
//                         <span class="note-priority">${task.priority}</span>
//                     </div>
//                     <div class="btn">
//                         <span>${task.date}</span>
//                         <span class="btn__success">&check;</span>
//                         <span class="btn__change">&times;</span>
//                         <span class="btn__danger">&#9998;</span>
//                     </div>
//                 </li>
//     `

//     tasksList.insertAdjacentHTML('beforeend', taskHTML)
// }












// //закрытие модалки при нажатии на esc
// window.addEventListener('keydown', (e) => {
//     if(e.key === 'Escape'){
//         reset()
//     }
// })

// //зыкрытие модалки при нажатии вне модалки
// window.onclick = function(e){
//     if(e.target === backgroundModal){
//         reset()
//     }
// }
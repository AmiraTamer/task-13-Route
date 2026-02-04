import { createCard } from "./card.js";
import type { Task } from "./interface";

let taskForm = document.getElementById("taskForm") as HTMLFormElement;
let taskTitleInput = document.querySelector("input[type=text]") as HTMLInputElement;
let taskDateInput = document.querySelector("input[type=date]") as HTMLInputElement;
let taskTextAreaInput = document.querySelector("textarea") as HTMLTextAreaElement;
let selectPriority = document.querySelector("select") as HTMLSelectElement;
let toDoContainer = document.getElementById("toDoContainer") as HTMLElement;
let CompletedContainer = document.getElementById("completedContainer") as HTMLElement;
let inProgressContainer = document.getElementById("inProgressContainer") as HTMLElement;
let completedTaskss = document.getElementById('completedTasks') as HTMLElement;  //De Type Assertion benesta5demha 3shan n2ool lel TypeScript en el element elly rag3 akeed HTML element mawgood w mesh null wala no3 3am.
let inProgressTaskss = document.getElementById('inProgressTasks') as HTMLElement;
let toDoTaskss = document.getElementById('toDoTasks') as HTMLElement;
let navBtn = document.getElementById('navBTN') as HTMLButtonElement;

let cancelBtn = document.getElementById("cancelBtn") as HTMLButtonElement;
let saveBtn = document.getElementById("saveBtn") as HTMLButtonElement;
let updateBtn = document.getElementById("updateBtn") as HTMLButtonElement;
let dateError = document.getElementById('date-error') as HTMLButtonElement;
let titleError=document.getElementById('title-error') as HTMLButtonElement;


let taskList: Task[] = JSON.parse(localStorage.getItem("allTasks") || "[]");
let updatedIdx: number | null = null;

// modallll
declare var bootstrap: any;
let modalEl = document.getElementById("taskModal") as HTMLElement;
let taskModal = new bootstrap.Modal(modalEl);

function openModal() {
    taskModal.show();
}
function closeModal() {
    taskModal.hide();
}

navBtn.addEventListener('click',function(){ //3shan ema a3ml add b3d update tegy elform fadya bs m4 mota2keda mn el7al da
    clearInputs();
    openModal();
});

cancelBtn.addEventListener("click", closeModal);



// add Task
saveBtn.addEventListener("click", function() {
// validation
    if (taskTitleInput.value.trim().length < 1) {
    titleError.classList.remove("d-none");
    taskTitleInput.classList.add("is-invalid");
    return;
  }
  if (taskDateInput.value && !isTodayOrFuture(taskDateInput.value)) {
    dateError.classList.remove("d-none");
    taskDateInput.classList.add("is-invalid");
    return;
  }

    let newTask: Task = {
        id: generateId(),
        title: taskTitleInput.value.trim(),
        description: taskTextAreaInput.value.trim(),
        dueDate: taskDateInput.value,
        priority: selectPriority.value as Task["priority"],
        status: "toDo",
        createdAt: Date.now(),
    };

    taskList.push(newTask);
    localStorage.setItem("allTasks", JSON.stringify(taskList));
    displayTask(taskList);
    clearInputs();
    closeModal();
});


//generate id  // m4fahmah aweeeeeeeeeee
function generateId(): string {
    let ids = taskList.map(t => parseInt(t.id.slice(1)));
    let newId = 1;
    while (ids.includes(newId)) newId++;
    return `#${newId.toString().padStart(3, "0")}`;
}


// Display cards Function
function displayTask(list: Task[]) {

  const emptyState = `
    <div class="empty-state text-center text-secondary fw-semibold py-4">
      <i class="fa-regular fa-folder-open fs-1 mb-2 opacity-50 text-secondary"></i>
      <p class="mb-0">No tasks yet</p>
      <small>Click + to add one</small>
    </div>
  `;

  //ta2seem el tasks 3la hasab el status
  const todoTasks = list.filter(task => task.status === "toDo");
  const inProgressTasks = list.filter(task => task.status === "inProgress");
  const completedTasks = list.filter(task => task.status === "completed");

  // display To Do
  toDoContainer.innerHTML = todoTasks.length
    ? todoTasks.map((task, i) => createCard(task, i)).join("")
    : emptyState;

  // display In Progress
  inProgressContainer.innerHTML = inProgressTasks.length
    ? inProgressTasks.map((task, i) => createCard(task, i)).join("")
    : emptyState;

  // display Completed
  CompletedContainer.innerHTML = completedTasks.length
    ? completedTasks.map((task, i) => createCard(task, i)).join("")
    : emptyState;

  //edit button
  document.querySelectorAll(".edit-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = (btn as HTMLElement).dataset.id!;
    editTaskById(id);
  });
});
//  Initialize  
displayTask(taskList);


  //delete button
 document.querySelectorAll(".delete-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = (btn as HTMLElement).dataset.id!;
    deleteTaskById(id);
  });

    document.querySelectorAll(".status-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const taskBtn = e.currentTarget as HTMLButtonElement;
        const task = taskList.find((t) => t.id === taskBtn.dataset.id)!;
        task.status = taskBtn.dataset.status as Task["status"];
        localStorage.setItem("allTasks", JSON.stringify(taskList));
        displayTask(taskList);
      });
    });
  });

  updateTaskCounter();
}


//  Clear inputs 
function clearInputs() {
    taskTitleInput.value = "";
    taskTextAreaInput.value = "";
    selectPriority.value = "Medium";
    taskDateInput.value = "";
}


//edittttttttttttt
function editTaskById(id: string) {
  const index = taskList.findIndex(t => t.id === id);
  if (index === -1) return;
  editTask(index);
}
//  Edit task 
function editTask(index: number) {
    let task = taskList[index];
    if (!task) return;
    updatedIdx = index;

    taskTitleInput.value = task.title;
    taskTextAreaInput.value = task.description ?? "";  // m3na el ?? ---> law el value b null or undefined 5od el value el 3la yemeen el ??
    taskDateInput.value = task.dueDate ?? "";
    selectPriority.value = task.priority;

    saveBtn.classList.add("d-none");
    updateBtn.classList.remove("d-none");

    openModal();
}


//  Update task 
updateBtn.addEventListener("click", () => {
    if (updatedIdx === null) return;

    let task = taskList[updatedIdx];
    if (!task) return;
 
    taskList[updatedIdx] = {
        ...task, // keep id, status, createdAt zay ma homa w deef  3la elgdeed
        title: taskTitleInput.value.trim(),
        description: taskTextAreaInput.value.trim(),
        dueDate: taskDateInput.value,
        priority: selectPriority.value as Task["priority"],
    };

    localStorage.setItem("allTasks", JSON.stringify(taskList));
    displayTask(taskList);

    updateBtn.classList.add("d-none");
    saveBtn.classList.remove("d-none");

    clearInputs();
    closeModal();
    updatedIdx = null;
});



//  Delete task 
function deleteTaskById(id: string) {
  const index = taskList.findIndex(t => t.id === id);
  if (index === -1) return;

  taskList.splice(index, 1);
  localStorage.setItem("allTasks", JSON.stringify(taskList));
  displayTask(taskList);
}




// Counter
function updateTaskCounter() {
  let todoCounter= taskList.filter(task => task.status === "toDo").length;
  let inProgressCounter= taskList.filter(task => task.status === "inProgress").length;
  let completedCounter= taskList.filter(task => task.status === "completed").length;

  toDoTaskss.textContent=`${todoCounter} tasks`;
  completedTaskss.textContent=`${completedCounter} tasks`;
  inProgressTaskss.textContent=`${inProgressCounter} tasks`;
  
}




// validation time
function isTodayOrFuture(dateString: string): boolean {
  const today = new Date();
  const selected = new Date(dateString);
  selected.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return selected.getTime() >= today.getTime();
}
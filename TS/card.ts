import type { Task } from "./interface";
export function createCard(task: Task, index: number): string {
  let priorityBadge = "";
  switch (task.priority) {
    case "Low":
      priorityBadge = `
             <span class="badge priority-badge text-primary bg-primary-subtle">
                                        <span class="priority-dot bg-primary"></span>
                                       Low
                                    </span>`;
      break;
    case "Medium":
      priorityBadge = `
             <span class="badge priority-badge text-warning bg-warning-subtle ">
                                       <span class="priority-dot bg-warning"></span>Medium
                                    </span>`;
      break;
    case "High":
      priorityBadge = `
             <span class="badge priority-badge bg-danger-subtle text-danger ">
                                     <span class="priority-dot bg-danger"></span>   High
                                    </span>`;
      break;
  }
  const completeBadge =
    task.status === "completed"
      ? ` <span class="badge priority-badge text-success bg-success-subtle ">
                                        <i class="fa-solid fa-check text-success"></i>
                                       Done
                                    </span>`
      : "";


let dueBadge = "";

  if (task.dueDate && task.status !== "completed") {
    const state = getDueDateState(task.dueDate);
    if (state === "overdue") {
      dueBadge = `  <span class="badge priority-badge text-danger bg-danger-subtle ">
                                        OVERDUE
                                    </span>`;
    }
    
  else if (state === "soon") {
    dueBadge = `
      <span class="badge priority-badge text-warning bg-warning-subtle">
        DUE SOON
      </span>`;
  }
  }

console.log(dueBadge);

   return `
    <div class="col-lg-12 p-3 card-col">

                <div class="card toDoCard p-3 shadow border-1 border-light-subtle border-opacity-25 ">
                            <div class="d-flex justify-content-between align-items-center mb-3 ">
                                    <div class="d-flex align-items-center ">
                                        <span class="dot rounded-circle ${task.status === "toDo" ? "bg-secondary" : task.status === "inProgress" ?"bg-warning":"bg-success" } me-2"></span>
                                        <span class="task-id text-secondary small fw-semibold ">${task.id}</span>
                                    </div>
                                
                                    <div class="task-actions">
                                        <button  class="btn btn-sm btn-light  edit-btn" title="Edit task " data-id="${task.id}">
                                            <i class="fa-solid fa-pen small text-primary"></i>
                                        </button>
    
                                        <button  class="btn btn-sm btn-light delete-btn text-danger" title="Delete task" data-id="${task.id}">
                                            <i class="fa-solid fa-trash-can small"></i>
                                        </button>
                                    </div>
                            </div>
    
                              
                                <h6 class="fw-semibold text-dark mb-2">
                                    ${task.title}
                                </h6>
                                <p class="fw-semibold text-secondary mb-2">
                                    ${task.description ? task.description : " "}
                                </p>
                            
                                <div class="d-flex flex-wrap align-items-center gap-2 mb-3">
                                    ${priorityBadge}
                                     ${dueBadge}
                                    ${completeBadge}
                                </div>
    
                             
                                <div class="d-flex align-items-center gap-3 small pb-3 mb-3 border-bottom">

                                      <div class="d-flex align-items-center gap-2 text-secondary">
                                        <i class="fa-regular fa-calendar"></i>
                                        <span>${task.dueDate}</span>
                                    </div>

                                    <div class="d-flex align-items-center gap-2 text-secondary">
                                        <i class="fa-regular fa-clock"></i>
                                        <span>1m ago</span>
                                    </div>
                                    
                                </div>
    
                              
                                ${renderStatusButtons(task)}
                                
                            
                    </div>
    </div>
   `;
}


function renderStatusButtons(task: Task): string {
  let buttons = "";
  if (task.status === "toDo") {
    buttons += `   <button class="btn status-btn btn-sm text-warning bg-warning-subtle px-4 py-2 " data-id='${task.id}' data-status="inProgress">
                                    <i class="fa-solid fa-play text-warning"></i> Start
                                </button>`;
    buttons += `  <button class="btn status-btn btn-sm text-success bg-success-subtle px-4 py-2" data-id='${task.id}' data-status="completed">
                                    <i class="fa-solid fa-check"></i> Complete
                                </button>`;
  } else if (task.status === "inProgress") {
    buttons += `   <button class="btn status-btn btn-sm text-secondary bg-secondary-subtle px-4 py-2 "  data-id='${task.id}' data-status="toDo">
                                    <i class="fa-solid fa-arrow-rotate-left text-secondary"></i> To Do
                                </button>
                                
                                `;
    buttons += `<button class="btn status-btn btn-sm text-success bg-success-subtle px-4 py-2"  data-id='${task.id}' data-status="completed">
                                    <i class="fa-solid fa-check"></i> Complete
                                </button>`;
  } else {
    buttons += `     <button class="btn status-btn btn-sm text-secondary bg-secondary-subtle px-4 py-2 " data-id='${task.id}'  data-status="toDo">
                                    <i class="fa-solid fa-arrow-rotate-left text-secondary"></i> To Do
                                </button> `;

    buttons += `    <button class="btn status-btn btn-sm text-warning bg-warning-subtle px-4 py-2 " data-id='${task.id}' data-status="inProgress">
                                    <i class="fa-solid fa-play text-warning"></i> Start
                                </button>`;
  }
  return `<div class="d-flex flex-wrap gap-2"> ${buttons}   </div>`;


}




function getDueDateState(dueDate: string): "normal" | "soon" | "overdue" {
  const now = new Date().getTime();
  const due = new Date(dueDate).getTime();
  const diff = due - now;
     console.log(now);
  console.log(diff);
 
    if (diff <= 24 * 60 * 60 * 1000) {
    return "overdue";
  }

  if (diff <= 24 * 60 * 60 * 1000 * 3) {
    return "soon";
  }


  return "normal";
}



// Base URL for the API endpoints
const API_BASE_URL = 'http://localhost:3000/api/task';

// Utility function to format dates (e.g., DD/MM/YYYY)
function formatDate(dateObj) {
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  return `${day}/${month}/${year}`;
}

// Utility function to format time (e.g., HH:MM AM/PM)
function formatTime(dateObj) {
  let hours = dateObj.getHours();
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}

// Parse DD/MM/YYYY HH:MM AM/PM format to ISO date string
function parseDateTimeToISO(dateTimeStr) {
  if (!dateTimeStr) return null;
  
  // Extract date and time parts
  const [datePart, timePart, ampm] = dateTimeStr.trim().split(' ');
  if (!datePart || !timePart || !ampm) return null;
  
  // Parse date DD/MM/YYYY
  const [day, month, year] = datePart.split('/');
  
  // Parse time HH:MM
  let [hours, minutes] = timePart.split(':');
  
  // Convert to 24-hour format
  if (ampm.toUpperCase() === 'PM' && hours !== '12') {
    hours = String(parseInt(hours) + 12);
  } else if (ampm.toUpperCase() === 'AM' && hours === '12') {
    hours = '00';
  }
  
  // Create ISO date string (YYYY-MM-DDTHH:MM:00)
  return `${year}-${month}-${day}T${hours.padStart(2, '0')}:${minutes}:00`;
}

async function fetchTasks(subjectId, teamId, search = '') {
    try {
      console.log('Fetching tasks with:', { subjectId, teamId, search });
  
      if (!subjectId || !teamId) {
        throw new Error('subjectId and teamId are required');
      }
  
      // Fetch both active and completed tasks
      const [tasksResponse, completedTasksResponse] = await Promise.all([
        // Fetch active tasks
        fetch(`${API_BASE_URL}?${new URLSearchParams({
          subjectId,
          teamId,
          search: search || ''
        })}`),
        // Fetch completed tasks
        fetch(`${API_BASE_URL}/completed?${new URLSearchParams({
          subjectId,
          teamId,
          search: search || ''
        })}`)
      ]);
  
      if (!tasksResponse.ok || !completedTasksResponse.ok) {
        throw new Error('Failed to fetch tasks');
      }
  
      const [activeTasks, completedTasks] = await Promise.all([
        tasksResponse.json(),
        completedTasksResponse.json()
      ]);
  
      // Combine active and completed tasks
      const allTasks = [
        ...(activeTasks.tasks || []),
        ...(completedTasks.tasks || []).map(task => ({
          ...task,
          status: 'completed'
        }))
      ];
  
      console.log('All tasks:', allTasks);
      renderTasks(allTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error.message);
      alert('Failed to fetch tasks. Check the console for details.');
    }
  }

// Render tasks into Available and Submitted sections
function renderTasks(tasks) {
    const availableTasksContainer = document.querySelector('#panelsStayOpen-collapseOne .accordion-body');
    const submittedTasksContainer = document.querySelector('#panelsStayOpen-collapseTwo .accordion-body');
  
    availableTasksContainer.innerHTML = '';
    submittedTasksContainer.innerHTML = '';
  
    if (!tasks) return;
  
    tasks.forEach(task => {
        const taskElement = createTaskElement(task);
        // Check if task is completed
        if (task.status === 'completed' || task.completed_date) {
            submittedTasksContainer.appendChild(taskElement);
        } else {
            availableTasksContainer.appendChild(taskElement);
        }
    });

    // Show/hide "No tasks" message
    if (availableTasksContainer.children.length === 0) {
        availableTasksContainer.innerHTML = '<div class="text-center text-muted">No available tasks</div>';
    }
    if (submittedTasksContainer.children.length === 0) {
        submittedTasksContainer.innerHTML = '<div class="text-center text-muted">No completed tasks</div>';
    }
}

function createTaskElement(task) {
  const container = document.createElement('div');
  const isCompleted = task.status === 'completed' || task.completed_date;
  
  container.className = isCompleted ? 'item-submitted-task container text-center p-0' : 'item-available-task container text-center p-0';
  
  container.dataset.taskId = isCompleted ? task.id : task.task_id;

  const today = new Date();
  const dueDate = new Date(task.due_date);
  const startDate = new Date(task.start_date || task.created_at);
  let status = 'Upcoming';
  let canComplete = false;

  if (isCompleted) {
    status = 'Completed';
  } else {
    if (dueDate < today) {
      status = 'Overdue';
      canComplete = true;
    } else if (startDate <= today && today <= dueDate) {
      status = 'In progress';
      canComplete = true;
    }
  }

  let statusHTML = '';
  if (isCompleted) {
    const completedDate = new Date(task.completed_date || task.completed_at);
    statusHTML = `
      <span class="status-of-task fw-medium" data-status="Completed">Completed</span>
      <span class="submitted-time fw-light text-secondary">${formatDate(completedDate)} ${formatTime(completedDate)}</span>
    `;
  } else {
    statusHTML = `
      <span class="status-of-task fw-medium" data-status="${status}">${status}</span>
      <div class="due-time fw-light">
        <span class="open-time text-secondary">${formatDate(startDate)}</span>
        <hr>
        <span class="end-time text-secondary">${formatDate(dueDate)}</span>
      </div>
    `;
  }

  // Nếu thích mất luôn checkbox thì dùng display:none, còn nếu muốn giữ khoảng cách thì dùng visibility: hidden;
  container.innerHTML = `
    <div class="row w-100 gx-4 align-items-center justify-content-center my-3">
      <div class="col check-task">
        ${!isCompleted ? `
          <div class="d-flex align-items-center">
            <input class="checkbox-complete-task" type="checkbox"
              data-task-id="${task.task_id}" 
              data-bs-toggle="modal" 
              data-bs-target="#modal-confirmation-check-task"
              style="${canComplete ? '' : 'display:none;'}">
              
            
            <div class="task text-start ms-3">
              <span class="task-title fw-medium">${task.title}</span>
              <span class="task-desc fw-light text-secondary">${task.description || ''}</span>
              ${!canComplete ? `
                <div class="status-of-task small fw-light" data-status="Upcoming">
                  Task not yet started
                </div>
              ` : ''}
              ${task.high_priority || task.reminder_time ? `
                <div class="additional-option d-flex align-items-center justify-content-between mt-1">
                  ${task.high_priority ? `
                    <div class="option-high-priority" style="font-size: 14px;">
                      <i class="fa-solid fa-flag text-primary"></i>
                      <span class="ms-1">High Priority</span>
                    </div>
                  ` : ''}
                  ${task.reminder_time ? `
                    <div class="option-reminder" style="font-size: 14px;">
                      <i class="fa-solid fa-clock text-success ms-3"></i>
                      <span class="ms-1">${formatTime(new Date(task.reminder_time))}</span>
                    </div>
                  ` : ''}
                </div>
              ` : ''}
            </div>
          </div>
        ` : `
          <div class="task text-start">
            <span class="task-title fw-medium">${task.title}</span>
            <span class="task-desc fw-light text-secondary">${task.description || ''}</span>
          </div>
        `}
      </div>

      <div class="col time-of-task">
        ${statusHTML}
      </div>

      <div class="action-list col text-end d-flex justify-content-end align-items-center text-primary">
        <div class="row g-4">
          ${!isCompleted ? `
            <div class="col fs-5 action-edit" data-task-id="${task.task_id}">
              <i class="fa-solid fa-pen-to-square"></i>
            </div>
          ` : ''}
          <div class="col fs-5 action-delete">
            <i class="fa-solid fa-trash-can"></i>
          </div>
          <div class="col fs-5 action-rank">
            <i class="fa-solid fa-ranking-star"></i>
          </div>
          <div class="col fs-5 action-comment">
            <i class="fa-solid fa-message"></i>
          </div>
        </div>
      </div>
    </div>
  `;

  return container;
}

// Create a new task
document.getElementById('createTaskForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const formData = new FormData(this);
  const urlParams = new URLSearchParams(window.location.search);
  
  // Get date range values
  const dateTimeRange = formData.get('datetimes');
  let startDate = null;
  let dueDate = null;
  
  if (dateTimeRange && dateTimeRange.includes(' - ')) {
    const [startDateStr, endDateStr] = dateTimeRange.split(' - ');
    startDate = parseDateTimeToISO(startDateStr);
    dueDate = parseDateTimeToISO(endDateStr);
  }
  
  const taskData = {
    title: document.getElementById('modal-task-name').value, 
    description: document.getElementById('modal-task-des').value,
    start_date: startDate,
    due_date: dueDate,
    subject_id: urlParams.get('subjectId') || 'CDIO',
    team_id: urlParams.get('teamId'),
    user_id: 1, // Placeholder; replace with actual user ID logic
    high_priority: document.getElementById('high-priority').checked,
    reminder_time: document.getElementById('time-reminder').checked ? new Date().toISOString() : null
  };

  console.log('Task data being sent:', taskData);

  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('API error response:', errorData);
      throw new Error(`Failed to create task: ${response.status} ${response.statusText}`);
    }
    
    await fetchTasks(urlParams.get('subjectId') || 'CDIO', urlParams.get('teamId'));
    openModalSuccessAction("Create task successfully!");
    bootstrap.Modal.getInstance(document.getElementById('reg-modal')).hide();
    const createTaskForm = document.getElementById('createTaskForm');
    createTaskForm.reset();
  } catch (error) {
    console.error('Error creating task:', error);
    alert(`Failed to create task: ${error.message}`);
  }
});

// Search tasks
document.addEventListener('DOMContentLoaded', function () {
  const urlParams = new URLSearchParams(window.location.search);
  const subjectId = urlParams.get('subjectId');
  const teamId = urlParams.get('teamId');
  console.log('URL Params:', { subjectId, teamId });
  fetchTasks(subjectId, teamId);
});

// Search tasks
document.getElementById('searchSubject').addEventListener('input', function () {
  const urlParams = new URLSearchParams(window.location.search);
  const subjectId = urlParams.get('subjectId');
  const teamId = urlParams.get('teamId');
  console.log('Search Params:', { subjectId, teamId, search: this.value });
  fetchTasks(subjectId, teamId, this.value);
});


// Mark task as completed (moves task to TaskCompleted)
document.querySelector('#modal-confirmation-check-task .btn-yes').addEventListener('click', async function () {
    const checkedBox = document.querySelector('.checkbox-complete-task:checked');
    if (!checkedBox) return;

    const taskId = checkedBox.getAttribute('data-task-id');
    const taskElement = checkedBox.closest('.item-available-task');
    
    try {
        // Move task to completed (this will handle both tables)
        const response = await fetch(`${API_BASE_URL}/complete/${taskId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.error || 'Failed to complete task');
        }

        // Refresh task lists
        const urlParams = new URLSearchParams(window.location.search);
        await fetchTasks(urlParams.get('subjectId') || 'CDIO', urlParams.get('teamId'));
        
        bootstrap.Modal.getInstance(document.getElementById('modal-confirmation-check-task')).hide();
        openModalSuccessAction('Task completed successfully!');
    } catch (error) {
        console.error('Error completing task:', error);
        openModalFailAction('Failed to complete task');
    }
});

// Delete task (handles both active and completed tasks)
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('action-delete') || e.target.closest('.action-delete')) {
        const taskElement = e.target.closest('[data-task-id]');
        if (!taskElement) return;

        // Check if task is in completed section
        const isCompleted = taskElement.closest('#panelsStayOpen-collapseTwo') !== null;
        const taskId = taskElement.dataset.taskId;
        
        console.log('Deleting task:', { taskId, isCompleted });

        const confirmModal = document.getElementById('modal-confirmation-delete');
        const yesButton = confirmModal.querySelector('.btn-yes');
        
        yesButton.dataset.taskId = taskId;
        yesButton.dataset.isCompleted = isCompleted;
        
        const modal = new bootstrap.Modal(confirmModal);
        modal.show();

        yesButton.onclick = async function () {
            try {
                // Use different endpoints based on which table the task is in
                const endpoint = this.dataset.isCompleted === 'true' 
                    ? `${API_BASE_URL}/completed/${this.dataset.taskId}`  // Delete from TaskCompleted
                    : `${API_BASE_URL}/${this.dataset.taskId}`;          // Delete from Task

                console.log('Delete endpoint:', endpoint);

                const response = await fetch(endpoint, { 
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => null);
                    throw new Error(errorData?.error || 'Failed to delete task');
                }

                // Refresh task lists
                const urlParams = new URLSearchParams(window.location.search);
                await fetchTasks(urlParams.get('subjectId') || 'CDIO', urlParams.get('teamId'));
                modal.hide();
                
                openModalSuccessAction('Task deleted successfully!');
            } catch (error) {
                console.error('Error deleting task:', error);
                openModalFailAction('Failed to delete task');
            }
        };
    }
});

// UPDATE task handler
document.addEventListener('click', async function (e) {
  if (e.target.classList.contains('action-edit') || e.target.closest('.action-edit')) {
      const taskElement = e.target.closest('.action-edit');
      const taskId = taskElement.getAttribute('data-task-id');
      
      try {
          const response = await fetch(`${API_BASE_URL}/${taskId}`);
          if (!response.ok) throw new Error('Failed to fetch task details');
          
          const task = await response.json();
          
          // Populate update form
          document.getElementById('update-task-id').value = task.task_id;
          document.getElementById('update-task-name').value = task.title;
          document.getElementById('update-task-description').value = task.description || '';
          
          // Set date range
          const startDate = task.start_date ? moment(task.start_date) : moment();
          const endDate = task.due_date ? moment(task.due_date) : moment().add(32, 'hour');
          
          // Initialize daterangepicker for update form
          $('input[name="update-datetimes"]').daterangepicker({
              timePicker: true,
              startDate: startDate,
              endDate: endDate,
              locale: {
                  format: 'DD/MM/YYYY hh:mm A'
              }
          });

          // Set checkboxes
          document.getElementById('update-high-priority').checked = task.high_priority;
          document.getElementById('update-time-reminder').checked = !!task.reminder_time;

          // Show update modal
          const modalElement = document.getElementById('update-task-modal');
          const modal = new bootstrap.Modal(modalElement);
          modal.show();

          // Handle update form submission
          const updateTaskForm = document.getElementById('updateTaskForm');
        
          updateTaskForm.onsubmit = function (event) {
              event.preventDefault();
              
              // Đợi modal cập nhật đóng hoàn toàn rồi mới mở modal xác nhận
              modalElement.addEventListener('hidden.bs.modal', function () {
                  openModalConfirmationUpdate();
              }, { once: true });
      
              modal.hide(); // Ẩn modal cập nhật
          };
      } catch (error) {
          console.error('Error fetching task details:', error);
          alert('Failed to load task details. Please try again.');
      }
  }
});

function openModalConfirmationUpdate() {
  // document.getElementById('team-name-edit').innerText = teamName; 
  const modalElement = document.getElementById('modal-confirmation-edit');
  const modal = new bootstrap.Modal(modalElement);

  modal.show();

  const confirmButton = document.getElementById('btn-confirm-edit');
  confirmButton.onclick = () => {
      updateTask();
      modal.hide();
  };
}

async function updateTask() {
  const taskId = document.getElementById('update-task-id').value;
  const dateTimeRange = document.querySelector('input[name="update-datetimes"]').value;
  
  let startDate = null;
  let dueDate = null;
  
  if (dateTimeRange && dateTimeRange.includes(' - ')) {
      const [startDateStr, endDateStr] = dateTimeRange.split(' - ');
      startDate = parseDateTimeToISO(startDateStr);
      dueDate = parseDateTimeToISO(endDateStr);
  }
  
  const taskData = {
      title: document.getElementById('update-task-name').value,
      description: document.getElementById('update-task-description').value,
      start_date: startDate,
      due_date: dueDate,
      high_priority: document.getElementById('update-high-priority').checked,
      reminder_time: document.getElementById('update-time-reminder').checked ? new Date().toISOString() : null
  };

  try {
      const response = await fetch(`${API_BASE_URL}/${taskId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData)
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update task');
      }

      // Refresh task list
      const urlParams = new URLSearchParams(window.location.search);
      await fetchTasks(urlParams.get('subjectId') || 'CDIO', urlParams.get('teamId'));
      
      // Hide modal and show success message
      bootstrap.Modal.getInstance(document.getElementById('update-task-modal')).hide();
      showModalActionSuccess('Task updated successfully!');
  } catch (error) {
      console.error('Error updating task:', error);
      alert(error.message || 'Failed to update task');
  }
}

// Handle update form submission
// document.getElementById('updateTaskForm').addEventListener('submit', async function(e) {
//   e.preventDefault();
  
//   const taskId = document.getElementById('update-task-id').value;
//   const dateTimeRange = document.querySelector('input[name="update-datetimes"]').value;
  
//   let startDate = null;
//   let dueDate = null;
  
//   if (dateTimeRange && dateTimeRange.includes(' - ')) {
//       const [startDateStr, endDateStr] = dateTimeRange.split(' - ');
//       startDate = parseDateTimeToISO(startDateStr);
//       dueDate = parseDateTimeToISO(endDateStr);
//   }
  
//   const taskData = {
//       title: document.getElementById('update-task-name').value,
//       description: document.getElementById('update-task-description').value,
//       start_date: startDate,
//       due_date: dueDate,
//       high_priority: document.getElementById('update-high-priority').checked,
//       reminder_time: document.getElementById('update-time-reminder').checked ? new Date().toISOString() : null
//   };

//   try {
//       const response = await fetch(`${API_BASE_URL}/${taskId}`, {
//           method: 'PUT',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(taskData)
//       });

//       if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData.error || 'Failed to update task');
//       }

//       // Refresh task list
//       const urlParams = new URLSearchParams(window.location.search);
//       await fetchTasks(urlParams.get('subjectId') || 'CDIO', urlParams.get('teamId'));
      
//       // Hide modal and show success message
//       bootstrap.Modal.getInstance(document.getElementById('update-task-modal')).hide();
//       showModalActionSuccess('Task updated successfully!');
//   } catch (error) {
//       console.error('Error updating task:', error);
//       alert(error.message || 'Failed to update task');
//   }
// });


// Initial fetch on page load
document.addEventListener('DOMContentLoaded', function () {
  const urlParams = new URLSearchParams(window.location.search);
  fetchTasks(urlParams.get('subjectId') || 'CDIO', urlParams.get('teamId'));
});

// SHOW MODAL ACTION FAIL OR SUCCESS
function openModalSuccessAction(message) {
  showModalActionSuccess(message);
}

function openModalFailAction(message) {
  showModalActionFail(message);
}


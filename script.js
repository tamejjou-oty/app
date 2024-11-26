document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("employee-login-form");
  const tasksContainer = document.getElementById("task-list");
  const tasksSection = document.getElementById("tasks");
  const loginSection = document.getElementById("login-form");
  const taskForm = document.getElementById("task-form");
  const newTaskForm = document.getElementById("new-task-form");
  const adminSection = document.getElementById("admin-section");
  const newEmployeeForm = document.getElementById("new-employee-form");
  const employeeTableBody = document.getElementById("employee-table-body");
  const employeeNameHeader = document.getElementById("employeeNameHeader");
  const editEmployeeModal = document.getElementById("edit-employee-modal");
  const editEmployeeForm = document.getElementById("edit-employee-form");
  const popupMessage = document.createElement("div");
  popupMessage.className = "popup-message";
  document.body.appendChild(popupMessage);
  let editingEmployee = null;

  const employees = JSON.parse(localStorage.getItem('employees')) || [
    {
      name: 'Employee One',
      role: 'employee',
      tasks: [
        {
          name: 'Task 1',
          details: 'Details for Task 1',
          deadline: '2024-12-01',
          completed: false,
          notes: ''
        },
        {
          name: 'Task 2',
          details: 'Details for Task 2',
          deadline: '',
          completed: false,
          notes: ''
        },
        {
          name: 'Task 3',
          details: 'Details for Task 3',
          deadline: '',
          completed: false,
          notes: ''
        }
      ]
    },
    {
      name: 'Employee Two',
      role: 'employee',
      tasks: [
        {
          name: 'Task A',
          details: 'Details for Task A',
          deadline: '',
          completed: false,
          notes: ''
        },
        {
          name: 'Task B',
          details: 'Details for Task B',
          deadline: '',
          completed: false,
          notes: ''
        },
        {
          name: 'Task C',
          details: 'Details for Task C',
          deadline: '',
          completed: false,
          notes: ''
        }
      ]
    },
    { name: 'Admin', role: 'admin', tasks: [] }
  ];

  let currentEmployee = null;
  let selectedEmployee = null; // المستخدم المحدد من الجدول

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const employeeName = document.getElementById("employeeName").value;
    currentEmployee = employees.find((emp) => emp.name === employeeName);

    if (currentEmployee) {
      loginSection.style.display = 'none';
      tasksSection.style.display = 'block';
      if (currentEmployee.role === 'admin') {
        adminSection.style.display = 'block';
        taskForm.style.display = 'block';
        renderEmployeeTable();
      } else {
        employeeNameHeader.textContent = currentEmployee.name;
        renderTasks(currentEmployee.tasks);
        selectedEmployee = currentEmployee; // التأكد من الاحتفاظ بالموظف المحدد
      }
    } else {
      showPopupMessage('Invalid Name');
    }
  });

  newEmployeeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const newEmployeeName = document.getElementById("newEmployeeName").value;
    if (employees.some((emp) => emp.name === newEmployeeName)) {
      showPopupMessage('Employee Name already exists');
    } else {
      employees.push({ name: newEmployeeName, role: 'employee', tasks: [] });
      localStorage.setItem('employees', JSON.stringify(employees)); // حفظ التعديلات في localStorage
      showPopupMessage('Employee added successfully');
      renderEmployeeTable();
    }
    newEmployeeForm.reset();
  });

  function renderEmployeeTable() {
    employeeTableBody.innerHTML = '';
    employees.forEach((employee) => {
      if (employee.role === 'employee') {
        const row = document.createElement("tr");
        const tasks = employee.tasks.map((task) => task.name).join(', ');
        row.innerHTML = `
          <td>${employee.name}</td>
          <td>${tasks}</td>
          <td>
            <button onclick="viewTasks('${employee.name}')">View Tasks</button>
            <button onclick="editEmployee('${employee.name}')">Edit Name</button>
          </td>
        `;
        employeeTableBody.appendChild(row);
      }
    });
  }

  window.viewTasks = function (employeeName) {
    selectedEmployee = employees.find((emp) => emp.name === employeeName);
    if (selectedEmployee) {
      employeeNameHeader.textContent = selectedEmployee.name;
      renderTasks(selectedEmployee.tasks);
    } else {
      showPopupMessage('Employee not found');
    }
  };

  window.editEmployee = function (employeeName) {
    editingEmployee = employees.find((emp) => emp.name === employeeName);
    if (editingEmployee) {
      document.getElementById("editEmployeeName").value = editingEmployee.name;
      editEmployeeModal.style.display = 'flex';
    } else {
      showPopupMessage('Employee not found');
    }
  };

  editEmployeeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const newName = document.getElementById("editEmployeeName").value;
    if (newName.trim() !== '') {
      editingEmployee.name = newName.trim();
      renderEmployeeTable();
      if (selectedEmployee && selectedEmployee.name === editingEmployee.name) {
        employeeNameHeader.textContent = newName.trim();
      }
      localStorage.setItem('employees', JSON.stringify(employees)); // حفظ التعديلات في localStorage
      editEmployeeModal.style.display = 'none';
    }
  });

  window.closeEditEmployeeModal = function () {
    editEmployeeModal.style.display = 'none';
  };

  function renderTasks(tasks) {
    tasksContainer.innerHTML = '';
    tasks.forEach((task, index) => {
      const taskElement = document.createElement("div");
      taskElement.className = `task ${task.completed ? 'completed' : 'incomplete'}`;
      taskElement.innerHTML = `
        <h3>${task.name}</h3>
        <p>${task.details}</p>
        <p>Deadline: ${task.deadline || 'No deadline'}</p>
        <p>Status: ${task.completed ? 'Completed' : 'Incomplete'}</p>
        <p>Notes: ${task.notes || 'No notes'}</p>
        <button onclick="toggleComplete(${index})">${task.completed ? 'Mark as Incomplete' : 'Mark as Completed'}</button>
        <button onclick="editNotes(${index})">Edit Notes</button>
        ${currentEmployee.role === 'admin' ? `<button onclick="editTask(${index})">Edit</button> <button onclick="deleteTask(${index})">Delete</button>` : ''}
      `;
      tasksContainer.appendChild(taskElement);
    });
  }

  window.toggleComplete = function (index) {
    if (selectedEmployee) {
      selectedEmployee.tasks[index].completed = !selectedEmployee.tasks[index].completed;
      localStorage.setItem('employees', JSON.stringify(employees)); // حفظ التعديلات في localStorage
      renderTasks(selectedEmployee.tasks);
    } else {
      showPopupMessage('Please select an employee first');
    }
  };

  window.editNotes = function (index) {
    if (selectedEmployee) {
      const newNotes = prompt('Enter new notes:', selectedEmployee.tasks[index].notes);
      if (newNotes !== null) {
        selectedEmployee.tasks[index].notes = newNotes.trim();
        localStorage.setItem('employees', JSON.stringify(employees)); // حفظ التعديلات في localStorage
        renderTasks(selectedEmployee.tasks);
      }
    } else {
      showPopupMessage('Please select an employee first');
    }
  };

  window.editTask = function (index) {
    if (selectedEmployee) {
      const task = selectedEmployee.tasks[index];
      document.getElementById("taskName").value = task.name;
      document.getElementById("details").value = task.details;
      document.getElementById("deadline").value = task.deadline;
      document.getElementById("taskIndex").value = index; // حقل مخفي لحفظ معرف المهمة
      taskForm.scrollIntoView({ behavior: 'smooth' }); // التمرير إلى قسم إضافة المهام
    } else {
      showPopupMessage('Please select an employee first');
    }
  };

  window.deleteTask = function (index) {
    if (selectedEmployee) {
      selectedEmployee.tasks.splice(index, 1);
      localStorage.setItem('employees', JSON.stringify(employees)); // حفظ التعديلات في localStorage
      renderTasks(selectedEmployee.tasks);
      renderEmployeeTable();
    } else {
      showPopupMessage('Please select an employee first');
    }
  };

  newTaskForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const taskName = document.getElementById("taskName").value;
    const details = document.getElementById("details").value;
    const deadline = document.getElementById("deadline").value;
    const taskIndex = document.getElementById("taskIndex").value;
    
      const newTask = {
        name: taskName,
        details: details,
        deadline: deadline,
        completed: false,
        notes: ''
      };
    
      if (taskIndex !== "") {
        selectedEmployee.tasks[taskIndex] = newTask;
      } else {
        selectedEmployee.tasks.push(newTask);
      }
    
      newTaskForm.reset();
      document.getElementById("taskIndex").value = ""; // إعادة تعيين الحقل المخفي
      localStorage.setItem('employees', JSON.stringify(employees)); // حفظ التعديلات في localStorage
      renderTasks(selectedEmployee.tasks);
      renderEmployeeTable();
    });
    
    function showPopupMessage(message) {
      popupMessage.textContent = message;
      popupMessage.style.display = 'block';
      setTimeout(() => {
        popupMessage.style.display = 'none';
      }, 3000);
    }
});


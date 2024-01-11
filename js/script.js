
function fetchUsers() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      loadUsers(JSON.parse(this.responseText));
    }
  };
  xhttp.open("GET", "https://61dc785d591c3a0017e1a96d.mockapi.io/api/v1/users", true);
  xhttp.send();
}

function validateAge() {
  var ageInput = document.getElementById("age");
  if (ageInput.value < 0) {
    ageInput.value = Math.abs(ageInput.value);
  }
}


function loadUsers(users) {
  var tableBody = document.querySelector("#usersTable tbody");
  tableBody.innerHTML = "";

  users.forEach(function (user) {
    var row = tableBody.insertRow();
    row.setAttribute("data-id", user.id);
    row.innerHTML = `
      <td>${user.userName}</td>
      <td>${user.age}</td>
      <td data-column="state">${user.state}</td>

      <td>
        <button  class="editBtn" onclick="editUser(${user.id})">&#9998;</button>
        <button  class="deleteBtn" onclick="deleteUser('${user.id}','${user.userName}')"><i class="fa fa-trash"></i></button>
        <button  class="editBtn1" onclick="SaveUser(${user.id})">&#9998;</button>
        </td>
    `;
  });
}

function addUser(event) {
  event.preventDefault();

  var form = document.querySelector("#addUserForm");
  var username = form.elements.username.value;
  var age = form.elements.age.value;
  var state = form.elements.state.value;

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 201) {
      form.reset();
      alert("User added successfully!");
    }
  };
  xhttp.open("POST", "https://61dc785d591c3a0017e1a96d.mockapi.io/api/v1/users", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify({ "userName": username, "age": age, "state": state }));
}


function editUser(userId) {
  var row = document.querySelector(`#usersTable tbody tr[data-id="${userId}"]`);
  var cells = row.getElementsByTagName("td");

  for (var i = 0; i < cells.length - 1; i++) {
    var cell = cells[i];
    var originalValue = cell.innerText;

    cell.innerHTML = `<input type="text" value="${originalValue}" data-original="${originalValue}">`;
  }
  var editBtn1 = row.querySelector(".editBtn1");

  editBtn1.innerHTML = "&#10004;";
  editBtn1.style.display = "inline";
  editBtn1.setAttribute("onclick", `saveUser(${userId})`);
}



function saveUser(userId) {
  var row = document.querySelector(`#usersTable tbody tr[data-id="${userId}"]`);
  var cells = row.getElementsByTagName("td");
  var newData = {};

  for (var i = 0; i < cells.length - 1; i++) {
    var cell = cells[i];
    var newValue = cell.querySelector("input").value;
    var columnName = cell.getAttribute("data-column");
    var originalValue = cell.querySelector("input").getAttribute("data-original");

    if (newValue !== originalValue) {
      newData[columnName] = newValue;
      cell.innerHTML = newData[columnName];
    } else {
      cell.innerHTML = originalValue; // Restore original value if unchanged
    }
  }

  if (Object.keys(newData).length > 0) {
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", `https://61dc785d591c3a0017e1a96d.mockapi.io/api/v1/users/${userId}`, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(newData));

    var editBtn1 = row.querySelector(".editBtn1");
    editBtn1.style.display = 'none';

  }

  var editBtn1 = row.querySelector(".editBtn1");
  var editBtn = row.querySelector(".editBtn");

  editBtn1.innerHTML = "&#9998;";
  editBtn1.style.display = 'none';

  editBtn1.setAttribute("onclick", `editUser(${userId})`);
  editBtn.style.visibility = "visible";
}



function deleteUser(userId, userName) {
  var confirmDelete = confirm("Delete: " + userName);
  if (confirmDelete) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        fetchUsers();
      }
    };
    xhttp.open("DELETE", `https://61dc785d591c3a0017e1a96d.mockapi.io/api/v1/users/${userId}`, true);
    xhttp.send();
  }
}


fetchUsers();

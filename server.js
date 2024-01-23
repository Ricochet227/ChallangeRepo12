const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '@lreadyDead227',
    database: 'company_db',
});

connection.connect(err => {
    if (err) throw err;
    console.log("Welcome To Ricochets Employee Tracker!");
    startMenu();
});

const startMenu = () => {
    inquirer.prompt({
        message: 'Please choose one of the following:',
        name: 'menu',
        type: 'list',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Delete a department',
            'Delete a role',
            'Delete an employee',
            'Exit',
        ],
    })

    .then(response => {
        if (response.menu === 'View all departments') {
            viewAllDepartments();
        } else if (response.menu === 'View all roles') {
            viewAllRoles();
        } else if (response.menu === 'View all employees') {
            viewAllEmployees();
        } else if (response.menu === 'Add a department') {
            addDepartment();
        } else if (response.menu === 'Add a role') {
            addRole();
        } else if (response.menu === 'Add an employee') {
            addEmployee();
        } else if (response.menu === 'Update an employee role') {
            updateEmployeeRole();
        } else if (response.menu === 'Delete a department') {
          deleteDepartment();
        } else if (response.menu === 'Delete a role') {
          deleteRole();
        } else if (response.menu === 'Delete an employee') {
          deleteEmployee();
        } else {
            connection.end();
        }
    });
};
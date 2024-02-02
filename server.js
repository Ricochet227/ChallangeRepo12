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
    console.log("Welcome to Ricochets The Office Employee Tracker!");
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
        } else {
            connection.end();
        }
    });
};

const viewAllDepartments = () => {
    connection.query('SELECT * FROM department', function (err, res) {
        if (err) throw err;
        console.table(res);
        startMenu();
    });
};

const viewAllRoles = () => {
    connection.query(`SELECT 
     r.id,
     r.title,
     d.name AS department,
     r.salary
     FROM role r
     JOIN department d ON r.department_id = d.id`, 
     (err, res) => {
        if (err) throw err;
        console.table(res);
        startMenu();
    });
};

const viewAllEmployees = () => {
    connection.query(`
    SELECT 
      e.id, 
      e.first_name, 
      e.last_name, 
      r.title, 
      d.name AS department, 
      r.salary, 
      CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e
    JOIN role r ON e.role_id = r.id
    JOIN department d ON r.department_id = d.id
    LEFT JOIN employee m ON e.manager_id = m.id
  `, (err, res) => {
        if (err) throw err;
        console.table(res);
        startMenu();
    });
};

const addDepartment = () => {
    inquirer.prompt([
        {
            name: 'department',
            type: 'input',
            message: 'Please enter a department.',
    
        },
    ])
    .then(answer => {
        connection.query(
            'INSERT INTO department (name) VALUES (?)',
            [answer.department],
            (err, res) => {
                if (err) throw err;
                console.log('Department successfully added!');
                startMenu();
            }
        );
    });
};

const addRole = () => {
    connection.query('SELECT id, name FROM department', (err, res) => {
        if (err) throw err;

        const departmentNames = res.reduce((acc, curr) => {
            acc[curr.name] = curr.id;
            return acc;
        }, {});
    
   inquirer.prompt([
    {
        name: 'role',
        type: 'input',
        message: 'Please enter your role in the company.'
    },
    {
        name: 'salary',
        type: 'input',
        message: 'Please enter your salary.'
    },
    {
        name: 'department',
        type: 'list',
        message: 'Please select which department your role is in.',
        choices: Object.keys(departmentNames),
    }
   ]).then(answer => {
    const departmentID = departmentNames[answer.department];
        connection.query(
                'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)',
                [answer.role, answer.salary, departmentID],
                function (err, res) {
                    if (err) throw err;
                    console.log('Role added!');
                    startMenu();
                }
            );
        })
    });
};

const addEmployee = () => {
    connection.query('SELECT id, title FROM role', (err, res) => {
        if (err) throw err;

        const roleNames = res.reduce((acc, curr) => {
            acc[curr.title] = curr.id;
            return acc;
        }, {});

    connection.query('SELECT id, first_name, last_name, manager_id FROM employee', (err, res) => {
        if (err) throw err;

        const managers = {};

        res.forEach((employee) => {
            const managerName = `${employee.first_name} ${employee.last_name}`;
            managers[managerName] = employee.id;
        });
    
        inquirer.prompt([
            {
                name: 'firstName',
                type: 'input',
                message: "Please enter your first name."
            },
            {
                name: 'lastName',
                type: 'input',
                message: "Please enter your last name."
            },
            {
                name: 'role',
                type: 'list',
                message: 'Please select your corresponding role in the company.',
                choices: Object.keys(roleNames),
            },
            {
                name: 'manager',
                type: 'list',
                message: 'Please select your manager from the team roster',
                choices: Object.keys(managers),
            }
        ]).then(answer => {
            const roleID = roleNames[answer.role];
            const managerID = managers[answer.manager];
            connection.query(
                'INSERT INTO employee SET ?',
                {
                  first_name: answer.firstName,
                  last_name: answer.lastName,
                  role_id: roleID,
                  manager_id: managerID
                },
                function (err, res) {
                  if (err) throw err;
      
                  console.log('Employee added!');
                  startMenu();
                });
            });
        });
    });
};

const updateEmployeeRole = () => {
    connection.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee', (err, res) => {
        if (err) throw err;
    
        const employees = res.reduce((acc, curr) => {
          acc[curr.name] = curr.id;
          return acc;
        }, {});
    
        connection.query('SELECT id, title FROM role', (err, res) => {
          if (err) throw err;
    
          const roles = res.reduce((acc, curr) => {
            acc[curr.title] = curr.id;
            return acc;
          }, {});
    
          inquirer.prompt([
            {
              name: 'employee',
              type: 'list',
              message: 'Select the employee to update:',
              choices: Object.keys(employees),
            },
            {
              name: 'role',
              type: 'list',
              message: 'Select the new role:',
              choices: Object.keys(roles),
            },
          ]).then(answer => {
            const employeeId = employees[answer.employee];
            const roleId = roles[answer.role];
    
            connection.query(
              'UPDATE employee SET role_id = ? WHERE id = ?',
              [roleId, employeeId],
              (err, res) => {
                if (err) throw err;
                console.log(`Role updated for ${answer.employee}`);
                startMenu();
              }
            );
          });
        });
      });
    };
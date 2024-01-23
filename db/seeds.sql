INSERT INTO department (name)
VALUES ("Management"),
        ("Sales"),
        ("Accounting"),
        ("Human Resources"),
        ("Customer Service"),
        ("Quality Assurance"),
        ("Office Administration");

INSERT INTO role (title, salary, department_id)
VALUES ("Branch Manger", 70000, 1),
        ("Assistant Branch Manager", 60000, 1),
        ("Salesman", 50000, 2),
        ("Accountant", 65000, 3),
        ("Human Resources Representative", 55000, 4),
        ("Customer Service Specialist", 55000, 5),
        ("QA Director", 50000, 6),
        ("Receptionist", 45000, 7);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Michael", "Scott", 1, 1),
        ("Jim", "Halpert", 3, NULL),
        ("Dwight", "Schrute", 2, 2),
        ("Stanley", "Hudson", 3, NULL),
        ("Phyllis", "Vance", 3, NULL),
        ("Oscar", "Martinez", 4, NULL),
        ("Angela", "Martin", 4, NULL),
        ("Kevin", "Malone", 4, NULL),
        ("Toby", "Flenderson", 5, NULL),
        ("Kelly", "Kapoor", 6, NULL),
        ("Creed", "Bratton", 7, NULL),
        ("Pam", "Beesly", 8, NULL),
        ("Erin", "Hannon", 8, NULL);
create DATABASE TODOLIST;

create table TODO(
    todoNo INT PRIMARY KEY,
    details varchar(255),
    Done varchar(255) DEFAULT 'No'
);

INSERT INTO TODO(todoNo,details) VALUES
(1,'Mown the lawn'),
(2,'Pack the bag'),
(3,'Complete Homework');

DROP TABLE TODO;

select * from TODO;
Create table blogs(
	id int primary key,
	title varchar(100),
	content varchar(1000),
	author varchar(20),
	date TIMESTAMP default now()
);
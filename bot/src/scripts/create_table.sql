drop table q;
CREATE TABLE q
(  
 id int IDENTITY(1,1) PRIMARY KEY,
 txt varchar (1000) not null,  
 asker varchar(100),
 answer varchar (100),
 liked int,
 create_time datetime
);  
drop table if exists [User];

create table [User]
(
  [id] integer primary key autoincrement,
  [username] nvarchar(100) not null,
  [email] nvarchar(255) null,
  [password] nvarchar(100) not null,
  [salt] nvarchar(200) not null,
  [active] int not null default 1,
  [currentBook] nvarchar(25) null
);

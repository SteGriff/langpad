drop table if exists [Logging];

create table [Logging]
(
  [id] integer primary key autoincrement,
  [created] int, -- unixepoch
  [event] nvarchar(30) not null,
  [key] nvarchar(255) null,
  [text] nvarchar(2000) null
);

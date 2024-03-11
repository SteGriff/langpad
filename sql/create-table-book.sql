drop table if exists [Book];

create table [Book]
(
  [CUID] nvarchar(25) primary key,
  [Name] text,
  [OwnerId] integer not null,
  [Privacy] integer not null default 0,
  [ElementsJson] text null
);

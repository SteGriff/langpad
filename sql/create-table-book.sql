drop table if exists [Book];

create table [Book]
(
  [CUID] nvarchar(25) primary key,
  [Name] text,
  [OwnerId] int not null,
  [Privacy] int not null default 0,
  [Updated] int,  -- unixepoch
  [ElementsJson] text null
);

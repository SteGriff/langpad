drop table if exists [Book];

create table [Book]
(
  [cuid] nvarchar(25) primary key,
  [name] text,
  [ownerId] int not null,
  [privacy] int not null default 0,
  [updated] int,  -- unixepoch
  [elementsJson] text null
);

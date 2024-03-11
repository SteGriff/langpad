export const upsertBook = (db, cuid, name, ownerId, elementsJson) => {
  db.prepare(
    `insert into [Book] (CUID, Name, OwnerId, ElementsJson) 
    values (?, ?, ?, ?)
    on conflict(CUID) do update
      set ElementsJson = excluded.ElementsJson`
  )
    .run(cuid, name, ownerId, dataJson);
};

export const getBooksForUser = (db, userId) => {
  return db
    .prepare("select * from [Book] where OwnerId = ?")
    .all(userId);
}

/*
create table [Book]
(
  [CUID] nvarchar(25) primary key,
  [Name] text,
  [OwnerId] integer not null,
  [Privacy] integer not null default 0,
  [ElementsJson] text null
);
*/
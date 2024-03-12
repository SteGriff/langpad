import { getSuccess } from "../results.mjs";

export const createOrUpdateBook = (db, cuid, name, ownerId, elementsJson) => {
  const model = upsertBook(db, cuid, name, ownerId, elementsJson);
  // TODO check success based on dbResult
  return getSuccess(model);
};

export const getBooks = (db, userId) => {
  const model = getBooksForUser(db, userId);
  // TODO check success based on dbResult
  return getSuccess(model);
};

const upsertBook = (db, cuid, name, ownerId, elementsJson) => {
  const dbResult = db.prepare(
    `insert into [Book] (CUID, Name, OwnerId, ElementsJson) 
    values (?, ?, ?, ?)
    on conflict(CUID) do update
      set ElementsJson = excluded.ElementsJson`
  )
    .run(cuid, name, ownerId, elementsJson);
  console.log("Upsert book", dbResult);
};

const getBooksForUser = (db, userId) => {
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
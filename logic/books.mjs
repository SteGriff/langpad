import { getSuccess } from "../results.mjs";

export const createOrUpdateBook = (db, cuid, name, ownerId, elementsJson) => {
  console.log("createOrUpdateBook req", cuid, name)
  const existingBook = getBookByCuid(db, cuid, ownerId);
  console.log("existingBook", existingBook);

  const elementsJsonString = JSON.stringify(elementsJson);

  if (existingBook)
    updateBook(db, cuid, name, ownerId, elementsJsonString);
  else
    insertBook(db, cuid, name, ownerId, elementsJsonString);

  //const model = upsertBook(db, cuid, name, ownerId, elementsJson);
  // TODO check success based on dbResult
  // TODO set User.CurrentBook to book CUID
  return getSuccess();
};

export const getBooks = (db, userId) => {
  const model = getBooksForUser(db, userId);
  // TODO check success based on dbResult
  return getSuccess(model);
};

const getBookByCuid = (db, cuid, ownerId) => {
  console.log("getBookByCuid req", cuid, ownerId)
  return db
    .prepare("select * from [Book] where CUID = ? and OwnerId = ?")
    .get(cuid, ownerId);
}

const insertBook = (db, cuid, name, ownerId, elementsJson) => {
  console.log("insertBook req", cuid, name, ownerId, elementsJson);
  const dbResult = db.prepare(
    `insert into [Book] 
    (CUID, Name, OwnerId, ElementsJson) 
    values (?, ?, ?, ?)`
  )
    .run(cuid, name, ownerId, elementsJson);
  console.log("insertBook res", dbResult);
};

const updateBook = (db, cuid, name, ownerId, elementsJson) => {
  console.log("updateBook req", cuid, name, ownerId, elementsJson);
  const dbResult = db.prepare(
    `update [Book] set 
    Name = ?
    ElementsJson = ?
    where CUID = ? and OwnerId = ?`
  )
    .run(name, elementsJson, cuid, ownerId);
  console.log("updateBook res", dbResult);
};

// const upsertBook = (db, cuid, name, ownerId, elementsJson) => {
//   const dbResult = db.prepare(
//     `insert into [Book] (CUID, Name, OwnerId, ElementsJson) 
//     values (?, ?, ?, ?)
//     on conflict(CUID) do update
//       set ElementsJson = excluded.ElementsJson`
//   )
//     .run(cuid, name, ownerId, elementsJson);
//   console.log("Upsert book", dbResult);
// };

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
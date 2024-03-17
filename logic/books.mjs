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

  // TODO check success based on dbResult
  // TODO set User.CurrentBook to book CUID
  return getSuccess();
};

export const getBooks = (db, userId, metadataOnly = false) => {
  const model = getBooksForUser(db, userId, metadataOnly);
  // TODO check success based on dbResult
  return getSuccess(model);
};

export const getBook = (db, cuid, userId) => getSuccess(getBookByCuid(db, cuid, userId));

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
    (CUID, Name, OwnerId, Updated, ElementsJson) 
    values (?, ?, ?, unixepoch(), ?)`
  )
    .run(cuid, name, ownerId, elementsJson);
  console.log("insertBook res", dbResult);
};

const updateBook = (db, cuid, name, ownerId, elementsJson) => {
  console.log("updateBook req", cuid, name, ownerId, elementsJson);
  const dbResult = db.prepare(
    `update [Book] set 
    Name = ?,
    ElementsJson = ?,
    Updated = unixepoch()
    where CUID = ? and OwnerId = ?`
  )
    .run(name, elementsJson, cuid, ownerId);
  console.log("updateBook res", dbResult);
};

const getBooksForUser = (db, userId, metadataOnly) => {
  let fieldList = "cuid, name, updated, ownerId, privacy";
  if (!metadataOnly) fieldList += ", ElementsJson as elements";

  return db
    .prepare(`select ${fieldList} from [Book] where OwnerId = ?`)
    .all(userId);
}

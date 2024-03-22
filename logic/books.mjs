import { getSuccess } from "../results.mjs";
import { EVT_BOOK_CREATE, EVT_BOOK_UPDATE, writeLog } from "./logging.mjs";

export const createOrUpdateBook = (db, cuid, name, ownerId, elementsJson) => {
  //console.log("createOrUpdateBook req", cuid, name)
  const existingBook = getBookByCuid(db, cuid, ownerId);

  const elementsJsonString = JSON.stringify(elementsJson);

  if (existingBook) {
    updateBook(db, cuid, name, ownerId, elementsJsonString);
    writeLog(db, EVT_BOOK_UPDATE, cuid, name);
  }
  else {
    insertBook(db, cuid, name, ownerId, elementsJsonString);
    writeLog(db, EVT_BOOK_CREATE, cuid, name);
  }

  setUserBook(db, ownerId, cuid);
  return getSuccess();
};

export const getBooks = (db, userId, metadataOnly = false) => {
  const model = getBooksForUser(db, userId, metadataOnly);
  console.log("getBooks", model);
  return getSuccess(model);
};

export const getBook = (db, cuid, userId) => getSuccess(getBookByCuid(db, cuid, userId));

const getBookByCuid = (db, cuid, ownerId) => {
  console.log("getBookByCuid req", cuid, ownerId)
  return db
    .prepare("select * from [Book] where cuid = ? and OwnerId = ?")
    .get(cuid, ownerId);
}

const insertBook = (db, cuid, name, ownerId, elementsJson) => {
  const dbResult = db.prepare(
    `insert into [Book] 
    (cuid, name, ownerId, updated, elementsJson) 
    values (?, ?, ?, unixepoch(), ?)`
  )
    .run(cuid, name, ownerId, elementsJson);
  return dbResult.changes > 0;
};

const updateBook = (db, cuid, name, ownerId, elementsJson) => {
  const dbResult = db.prepare(
    `update [Book] set 
    name = ?,
    elementsJson = ?,
    updated = unixepoch()
    where cuid = ? and ownerId = ?`
  )
    .run(name, elementsJson, cuid, ownerId);
  return dbResult.changes > 0;
};

const getBooksForUser = (db, userId, metadataOnly) => {
  let fieldList = "cuid, name, updated, ownerId, privacy";
  if (!metadataOnly) fieldList += ", elementsJson as elements";

  return db
    .prepare(`select ${fieldList} from [Book] where OwnerId = ?`)
    .all(userId);
}

const setUserBook = (db, userId, cuid) => {
  const dbResult = db.prepare(
    `update [User] set 
    currentBook = ?,
    id = ?`
  )
    .run(cuid, userId);
  return dbResult.changes > 0;
};
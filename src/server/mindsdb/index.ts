import MindsDB, { type SqlQueryResult } from "mindsdb-js-sdk";
import { MINDSDB_HOST_URL } from "./constants";

export async function connectMindsDB(): Promise<boolean> {
  try {
    // No authentication needed for self-hosting
    await MindsDB.connect({
      host: MINDSDB_HOST_URL,
      user: "",
      password: "",
    });
    console.log(
      "\n----------------------------------- connected to mindsDB -----------------------------------\n"
    );
    return true;
  } catch (error) {
    // Failed to connect to local instance
    console.log(error);
  }
  return false;
}

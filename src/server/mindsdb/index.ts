import MindsDB from "mindsdb-js-sdk";
import { env } from "~/env";

export async function connectMindsDB(): Promise<boolean> {
  try {
    // No authentication needed for self-hosting
    await MindsDB.connect({
      host: env.MINDSDB_HOST_URL,
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

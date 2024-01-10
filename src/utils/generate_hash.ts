import crypto from "crypto";

export function generateCommentHash(text: string) {
  const hash = crypto.createHash("sha256");
  hash.update(text, "utf-8");
  return hash.digest("hex");
}

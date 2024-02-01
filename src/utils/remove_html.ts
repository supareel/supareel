import sanitizeFile from "sanitize-filename";
import sanitizeHtml from "sanitize-html";

export function removeHtmlTags(inputString: string): string {
  // Use a regular expression to remove HTML tags and content
  return sanitizeFile(sanitizeHtml(inputString));
}

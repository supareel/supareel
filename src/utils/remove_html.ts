export function removeHtmlTags(inputString: string): string {
  // Use a regular expression to remove HTML tags and content
  return inputString
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/g, "")
    .replace(/<|>/g, "")
    .replace(/\.\.\//g, "");
}

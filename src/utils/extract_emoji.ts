export function separateEmojiFromText(input: string) {
  // Regular expression to match emoji characters
  const emojiRegex =
    /[\p{Emoji_Presentation}\p{Emoji}\p{Emoji_Modifier_Base}\p{Emoji_Modifier}\p{Emoji_Component}]/gu;

  // Extract emojis from the input
  const emojis = input.match(emojiRegex) ?? [];

  // Remove emojis from the original input to get the text
  const text = input.replace(emojiRegex, "");

  return {
    text: text.trim(),
    emojis: emojis.join(" "),
  };
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// correct: incorrect
export const PUNCTUATION_MARKS: { [key: string]: string } = {
  '（': '(',
  '）': ')',
  '，': ',',
  '？': '?',
  '：': ':',
  '；': ';',
  '！': '!',
  '－': '-',
  '．': '＆dot:',
  '……': '＆dots:',
  '「': '＆obracket:',
  '」': '＆cbracket:',
};

export function fixPunctuation(text: string) {
  for (let punctuation of Object.keys(PUNCTUATION_MARKS))
    text = text.replaceAll(PUNCTUATION_MARKS[punctuation], punctuation);

  return text;
}

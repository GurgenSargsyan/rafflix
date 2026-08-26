/**
 * Генератор "стильных шрифтов" — честная client-side трансформация текста в
 * Unicode-псевдошрифты (Mathematical Alphanumeric Symbols + Fullwidth).
 * Никакого API и никаких "моков": это чистая функция над текстом, который
 * ввёл пользователь — то, что видно, то и есть результат.
 *
 * Символы вне A-Z/a-z/0-9 (кириллица, пробелы, эмодзи, пунктуация) не
 * заменяются — большинство этих Unicode-блоков определены только для
 * латиницы, поэтому смешанный текст выглядит как "частично стилизованный",
 * что ожидаемо для инструментов такого типа.
 */

interface FontStyle {
  id: string;
  label: string;
  /** Базовый codepoint для 'A', 'a' и '0' — если блок их не поддерживает, пусто. */
  upperBase?: number;
  lowerBase?: number;
  digitBase?: number;
  /** Точечные исключения (напр. Mathematical Italic 'h' -> PLANCK CONSTANT). */
  exceptions?: Record<string, string>;
}

const STYLES: FontStyle[] = [
  { id: "bold", label: "Bold", upperBase: 0x1d400, lowerBase: 0x1d41a, digitBase: 0x1d7ce },
  { id: "italic", label: "Italic", upperBase: 0x1d434, lowerBase: 0x1d44e, exceptions: { h: "ℎ" } },
  { id: "bold-italic", label: "Bold Italic", upperBase: 0x1d468, lowerBase: 0x1d482 },
  { id: "script", label: "Script", upperBase: 0x1d4d0, lowerBase: 0x1d4ea },
  { id: "fraktur", label: "Fraktur", upperBase: 0x1d56c, lowerBase: 0x1d586 },
  { id: "sans-bold", label: "Sans Bold", upperBase: 0x1d5d4, lowerBase: 0x1d5ee, digitBase: 0x1d7ec },
  { id: "sans-italic", label: "Sans Italic", upperBase: 0x1d608, lowerBase: 0x1d622 },
  { id: "monospace", label: "Monospace", upperBase: 0x1d670, lowerBase: 0x1d68a, digitBase: 0x1d7f6 },
  { id: "fullwidth", label: "Fullwidth", upperBase: 0xff21, lowerBase: 0xff41, digitBase: 0xff10 },
];

function transformChar(char: string, style: FontStyle): string {
  if (style.exceptions?.[char]) return style.exceptions[char];

  const code = char.codePointAt(0)!;
  if (style.upperBase != null && code >= 65 && code <= 90) {
    return String.fromCodePoint(style.upperBase + (code - 65));
  }
  if (style.lowerBase != null && code >= 97 && code <= 122) {
    return String.fromCodePoint(style.lowerBase + (code - 97));
  }
  if (style.digitBase != null && code >= 48 && code <= 57) {
    return String.fromCodePoint(style.digitBase + (code - 48));
  }
  return char;
}

export function applyFontStyle(text: string, styleId: string): string {
  const style = STYLES.find((s) => s.id === styleId);
  if (!style) return text;
  return Array.from(text).map((c) => transformChar(c, style)).join("");
}

export function getFontStyles(): { id: string; label: string }[] {
  return STYLES.map(({ id, label }) => ({ id, label }));
}

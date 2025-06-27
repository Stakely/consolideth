import { FC, ReactNode } from 'react';
import { Pixel, Rem, useTheme } from '@/providers/theme-provider';

export type TextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'body1'
  | 'body2'
  | 'littleBody'
  | 'largeKeyNumber'
  | 'mediumKeyNumber'
  | 'littleKeyNumber'
  | 'logo';

export type TextProps = {
  /** The variant (set of styles) of the text */
  variant?: TextVariant;

  /** The content of the text */
  content?: string;

  /** Whether the text will be in uppercase */
  uppercase?: boolean;

  /** The weight of the font to be displayed (100 - 900) **/
  weight?: number;

  /** The color of the font to be displayed **/
  color?: string;

  /** The text alignment */
  align?: 'left' | 'center' | 'right';

  /** Whether the text is in italic style. */
  italic?: boolean;

  /** Whether the text has a line through */
  lineThrough?: boolean;

  /** Whether the text is underlined */
  underline?: boolean;

  /** Forces the font size **/
  forceSize?: Pixel | Rem;

  /** Forces the line height */
  forceLineHeight?: number;

  /** Alt message to be displayed when hovered */
  alt?: string;
};

/**
 * Text component that contains all the different variants to be used in the app.
 * It also supports a custom template engine to interpolate messages.
 *
 */
export const Text: FC<TextProps> = ({
  variant = 'body1',
  content = '',
  uppercase = false,
  weight,
  align = 'left',
  italic = false,
  alt = '',
  lineThrough = false,
  underline = false,
  forceSize,
  forceLineHeight,
  color,
}: TextProps): ReactNode => {
  const { colors, fonts } = useTheme();

  const getWeight = (): number => {
    return fonts[variant as keyof typeof fonts].weight;
  };

  const getSize = (): Rem | Pixel => {
    if (forceSize) {
      return forceSize;
    }

    return fonts[variant as keyof typeof fonts].size;
  };

  const getLineHeight = (): Rem | number => {
    if (forceLineHeight) {
      return forceLineHeight;
    }

    return fonts[variant as keyof typeof fonts].lineHeight;
  };

  const getFontFamily = (): string => {
    return fonts[variant as keyof typeof fonts].font;
  };

  const getColor = (): string => {
    if (color) {
      return color;
    }

    return colors.background['00'];
  };

  const parseTemplate = (content: string): ReactNode[] => {
    const linkRegex = /<l:(.*?)>(.*?)<\/l>/g;

    const lines = content.split('\n');
    const parts: React.ReactNode[] = [];

    lines.forEach((line, lineIndex) => {
      let lastIndex = 0;
      let match;
      const elements: ReactNode[] = [];

      while ((match = linkRegex.exec(line)) !== null) {
        const [fullMatch, url, linkText] = match;

        if (match.index > lastIndex) {
          const before = line.slice(lastIndex, match.index);
          elements.push(...parseBold(before, `bold-${lineIndex}-${lastIndex}`));
        }

        elements.push(
          <a
            key={`link-${lineIndex}-${match.index}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'underline', color: 'inherit' }}
          >
            {linkText}
          </a>
        );

        lastIndex = match.index + fullMatch.length;
      }

      if (lastIndex < line.length) {
        const remaining = line.slice(lastIndex);
        elements.push(...parseBold(remaining, `bold-${lineIndex}-rest`));
      }

      parts.push(...elements);

      if (lineIndex < lines.length - 1) {
        parts.push(<br key={`br-${lineIndex}`} />);
      }
    });

    return parts;
  };

  const parseBold = (text: string, keyPrefix: string): ReactNode[] => {
    const result: ReactNode[] = [];
    const boldRegex = /<b>(.*?)<\/b>/g;

    let lastIndex = 0;
    let match;
    let matchIndex = 0;

    while ((match = boldRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        result.push(text.slice(lastIndex, match.index));
      }

      result.push(
        <strong key={`${keyPrefix}-${matchIndex}`}>{match[1]}</strong>
      );

      lastIndex = match.index + match[0].length;
      matchIndex++;
    }

    if (lastIndex < text.length) {
      result.push(text.slice(lastIndex));
    }

    return result;
  };

  return (
    <span
      title={alt}
      style={{
        fontWeight: weight ? weight : getWeight(),
        fontSize: getSize(),
        lineHeight: getLineHeight(),
        fontFamily: getFontFamily(),
        textTransform: uppercase ? 'uppercase' : 'none',
        color: getColor(),
        textAlign: align,
        fontStyle: italic ? 'italic' : 'normal',
        textDecoration: lineThrough
          ? 'line-through'
          : underline
            ? 'underline'
            : 'none',
      }}
    >
      {parseTemplate(content)}
    </span>
  );
};

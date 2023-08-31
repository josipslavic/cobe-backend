import { SHORTENED_ARTICLE_MAX_LENGTH } from '../constants/numbers';

export function trimDescription(desc: string) {
  if (desc.length < SHORTENED_ARTICLE_MAX_LENGTH) return desc;
  return (
    desc.substring(
      0,
      SHORTENED_ARTICLE_MAX_LENGTH +
        desc.substring(SHORTENED_ARTICLE_MAX_LENGTH).indexOf(' ')
    ) + '...'
  );
}

import {
  SHORTENED_ARTICLE_MAX_LENGTH,
  SHORTENED_ARTICLE_MIN_LENGTH,
} from '../constants/numbers'

export function trimDescription(desc: string) {
  if (desc.length < SHORTENED_ARTICLE_MAX_LENGTH) return desc
  return (
    desc.substring(
      SHORTENED_ARTICLE_MIN_LENGTH,
      SHORTENED_ARTICLE_MAX_LENGTH +
        desc.substring(SHORTENED_ARTICLE_MAX_LENGTH).indexOf(' ')
    ) + '...'
  )
}

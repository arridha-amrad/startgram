import { pgEnum } from 'drizzle-orm/pg-core'

export const genders = ['-', 'female', 'male'] as const
export const medias = ['image', 'video'] as const
export const aspectRatios = ['1 / 1', '4 / 5', '9 / 16'] as const

export const genderEnum = pgEnum('gender_options_enum', genders)

export const mediaTypeEnum = pgEnum('media_type', medias)

export const aspectRatioEnum = pgEnum('aspect_ratio', aspectRatios)
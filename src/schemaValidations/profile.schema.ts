import * as yup from 'yup'

export const CreateProfileBody = yup.object({
  name: yup
    .string()
    .required('TÃªn lÃ  báº¯t buá»™c')
    .min(2, 'TÃªn pháº£i cÃ³ Ã­t nháº¥t 2 kÃ½ tá»±')
    .max(50, 'TÃªn khÃ´ng Ä‘Æ°á»£c quÃ¡ 50 kÃ½ tá»±')
    .trim(),
  age: yup
    .number()
    .required('Tuá»•i lÃ  báº¯t buá»™c')
    .min(13, 'Tuá»•i pháº£i tá»« 13 trá»Ÿ lÃªn')
    .max(120, 'Tuá»•i khÃ´ng Ä‘Æ°á»£c quÃ¡ 120')
    .integer('Tuá»•i pháº£i lÃ  sá»‘ nguyÃªn'),
  gender: yup
    .string()
    .required('Giá»›i tÃ­nh lÃ  báº¯t buá»™c')
    .oneOf(['male', 'female', 'other'], 'Giá»›i tÃ­nh pháº£i lÃ  male, female hoáº·c other'),
  bio: yup.string().max(500, 'Bio khÃ´ng Ä‘Æ°á»£c quÃ¡ 500 kÃ½ tá»±').trim().notRequired().default(''),
  email: yup.string().required('Email lÃ  báº¯t buá»™c').email('Email khÃ´ng há»£p lá»‡').trim(),
  password: yup
    .string()
    .required('Máº­t kháº©u lÃ  báº¯t buá»™c')
    .min(6, 'Máº­t kháº©u pháº£i cÃ³ Ã­t nháº¥t 6 kÃ½ tá»±')
    .max(50, 'Máº­t kháº©u khÃ´ng Ä‘Æ°á»£c quÃ¡ 50 kÃ½ tá»±')
})

export type CreateProfileBodyType = yup.InferType<typeof CreateProfileBody>

export const CreateProfileRes = yup.object({
  message: yup.string().required(),
  data: yup.object({
    id: yup.number().required(),
    name: yup.string().required(),
    age: yup.number().required(),
    gender: yup.string().oneOf(['male', 'female', 'other']).required(),
    bio: yup.string().optional(),
    email: yup.string().email().required(),
    created_at: yup.string().required()
  })
})

export type CreateProfileResType = yup.InferType<typeof CreateProfileRes>

export const LoginBody = yup.object({
  email: yup.string().required('Email lÃ  báº¯t buá»™c').email('Email khÃ´ng há»£p lá»‡').trim(),
  password: yup.string().required('Máº­t kháº©u lÃ  báº¯t buá»™c')
})

export type LoginBodyType = yup.InferType<typeof LoginBody>

export const LoginRes = yup.object({
  message: yup.string().required(),
  data: yup.object({
    id: yup.number().required(),
    name: yup.string().required(),
    age: yup.number().required(),
    gender: yup.string().oneOf(['male', 'female', 'other']).required(),
    bio: yup.string().optional(),
    email: yup.string().email().required(),
    created_at: yup.string().required(),
    access_token: yup.string().required()
  })
})

export type LoginResType = yup.InferType<typeof LoginRes>

export const GetAllProfilesRes = yup.object({
  message: yup.string().required(),
  data: yup.array().of(
    yup.object({
      id: yup.number().required(),
      name: yup.string().required(),
      age: yup.number().required(),
      gender: yup.string().oneOf(['male', 'female', 'other']).required(),
      bio: yup.string().optional(),
      email: yup.string().email().required(),
      created_at: yup.string().required()
    })
  )
})

export type GetAllProfilesResType = yup.InferType<typeof GetAllProfilesRes>

export const GetProfileByIdRes = yup.object({
  message: yup.string().required(),
  data: yup.object({
    id: yup.number().required(),
    name: yup.string().required(),
    age: yup.number().required(),
    gender: yup.string().oneOf(['male', 'female', 'other']).required(),
    bio: yup.string().optional(),
    email: yup.string().email().required(),
    created_at: yup.string().required()
  })
})

export type GetProfileByIdResType = yup.InferType<typeof GetProfileByIdRes>

export const LikeProfileBody = yup.object({
  from_user_id: yup.number().required()
})

export type LikeProfileBodyType = yup.InferType<typeof LikeProfileBody>

export const LikeProfileRes = yup.object({
  message: yup.string().required(),
  data: yup.object({
    isMatch: yup.boolean().required()
  })
})

export type LikeProfileResType = yup.InferType<typeof LikeProfileRes>

export const GetMatchesRes = yup.object({
  message: yup.string().required(),
  data: yup.array().of(
    yup.object({
      match_id: yup.number().required(),
      matched_at: yup.string().required(),
      profile: yup.object({
        id: yup.number().required(),
        name: yup.string().required(),
        age: yup.number().required(),
        gender: yup.string().oneOf(['male', 'female', 'other']).required(),
        bio: yup.string().optional()
      })
    })
  )
})

export type GetMatchesResType = yup.InferType<typeof GetMatchesRes>

export const GetLikedProfilesRes = yup.object({
  message: yup.string().required(),
  data: yup.array().of(
    yup.object({
      like_id: yup.number().required(),
      liked_at: yup.string().required(),
      profile: yup.object({
        id: yup.number().required(),
        name: yup.string().required(),
        age: yup.number().required(),
        gender: yup.string().oneOf(['male', 'female', 'other']).required(),
        bio: yup.string().optional()
      })
    })
  )
})

export type GetLikedProfilesResType = yup.InferType<typeof GetLikedProfilesRes>

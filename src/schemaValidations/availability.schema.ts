import * as yup from 'yup'

export const AddAvailabilityBody = yup.object({
  user_id: yup.number().required(),
  match_id: yup.number().required(),
  availabilities: yup.array().of(
    yup.object({
      date: yup.string().required(), // YYYY-MM-DD
      start_time: yup.string().required(), // HH:mm
      end_time: yup.string().required() // HH:mm
    })
  ).required()
})

export type AddAvailabilityBodyType = yup.InferType<typeof AddAvailabilityBody>

export const AddAvailabilityRes = yup.object({
  message: yup.string().required(),
  data: yup.object({
    count: yup.number().required()
  })
})

export type AddAvailabilityResType = yup.InferType<typeof AddAvailabilityRes>

export const GetAvailabilityRes = yup.object({
  message: yup.string().required(),
  data: yup.array().of(
    yup.object({
      id: yup.number().required(),
      user_id: yup.number().required(),
      match_id: yup.number().required(),
      date: yup.string().required(),
      start_time: yup.string().required(),
      end_time: yup.string().required(),
      created_at: yup.string().required()
    })
  )
})

export type GetAvailabilityResType = yup.InferType<typeof GetAvailabilityRes>

export const FindCommonDateBody = yup.object({
  match_id: yup.number().required()
})

export type FindCommonDateBodyType = yup.InferType<typeof FindCommonDateBody>

export const FindCommonDateRes = yup.object({
  message: yup.string().required(),
  data: yup.object({
    found: yup.boolean().required(),
    date: yup.object({
      id: yup.number().optional(),
      match_id: yup.number().optional(),
      date: yup.string().optional(),
      start_time: yup.string().optional(),
      end_time: yup.string().optional(),
      created_at: yup.string().optional()
    }).nullable()
  })
})

export type FindCommonDateResType = yup.InferType<typeof FindCommonDateRes>

export const GetDateRes = yup.object({
  message: yup.string().required(),
  data: yup.object({
    id: yup.number().required(),
    match_id: yup.number().required(),
    date: yup.string().required(),
    start_time: yup.string().required(),
    end_time: yup.string().required(),
    created_at: yup.string().required()
  })
})

export type GetDateResType = yup.InferType<typeof GetDateRes>


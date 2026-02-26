import type {
  AddAvailabilityBodyType,
  AddAvailabilityResType,
  GetAvailabilityResType,
  FindCommonDateBodyType,
  FindCommonDateResType,
  GetDateResType
} from '../schemaValidations/availability.schema'
import http from '../utils/http'

const availabilityApiRequest = {
  addAvailability(body: AddAvailabilityBodyType) {
    return http.post<AddAvailabilityResType>('/availability', body)
  },

  getAvailability(userId: number, matchId: number) {
    return http.get<GetAvailabilityResType>(`/availability/${userId}/${matchId}`)
  },

  findCommonDate(body: FindCommonDateBodyType) {
    return http.post<FindCommonDateResType>('/dates/find-common', body)
  },

  getDate(matchId: number) {
    return http.get<GetDateResType>(`/dates/${matchId}`)
  }
}

export default availabilityApiRequest


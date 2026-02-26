import type {
  CreateProfileBodyType,
  CreateProfileResType,
  LoginBodyType,
  LoginResType,
  GetAllProfilesResType,
  GetProfileByIdResType,
  LikeProfileBodyType,
  LikeProfileResType,
  GetMatchesResType,
  GetLikedProfilesResType
} from '../schemaValidations/profile.schema'
import http from '../utils/http'

export const URL_LOGIN = '/profile/login'
export const URL_LOGOUT = 'logout'

const profileApiRequest = {
  createProfile(body: CreateProfileBodyType) {
    return http.post<CreateProfileResType>('/profile/create', body)
  },

  login(body: LoginBodyType) {
    return http.post<LoginResType>('/profile/login', body)
  },

  getAllProfiles() {
    return http.get<GetAllProfilesResType>('/profile')
  },

  getProfileById(id: number) {
    return http.get<GetProfileByIdResType>(`/profile/${id}`)
  },

  likeProfile(toUserId: number, body: LikeProfileBodyType) {
    return http.post<LikeProfileResType>(`/profile/${toUserId}/like`, body)
  },

  getLikedProfiles(userId: number) {
    return http.get<GetLikedProfilesResType>(`/profile/${userId}/likes`)
  },

  getMatches(userId: number) {
    return http.get<GetMatchesResType>(`/profile/${userId}/matches`)
  }
}

export default profileApiRequest

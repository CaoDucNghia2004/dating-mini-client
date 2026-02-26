import { useMutation, useQuery } from '@tanstack/react-query'
import profileApiRequest from '../apis/profile.api'

export const useCreateProfileMutation = () => {
  return useMutation({
    mutationFn: profileApiRequest.createProfile
  })
}

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: profileApiRequest.login
  })
}

export const useGetAllProfilesQuery = () => {
  return useQuery({
    queryKey: ['profiles'],
    queryFn: () => profileApiRequest.getAllProfiles()
  })
}

export const useGetProfileByIdQuery = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['profile', id],
    queryFn: () => profileApiRequest.getProfileById(id),
    enabled: enabled && !!id // Chỉ fetch khi enabled = true và có id
  })
}

export const useLikeProfileMutation = () => {
  return useMutation({
    mutationFn: ({ toUserId, fromUserId }: { toUserId: number; fromUserId: number }) =>
      profileApiRequest.likeProfile(toUserId, { from_user_id: fromUserId })
  })
}

export const useGetLikedProfilesQuery = (userId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['likedProfiles', userId],
    queryFn: () => profileApiRequest.getLikedProfiles(userId),
    enabled: enabled && !!userId
  })
}

export const useGetMatchesQuery = (userId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['matches', userId],
    queryFn: () => profileApiRequest.getMatches(userId),
    enabled: enabled && !!userId
  })
}

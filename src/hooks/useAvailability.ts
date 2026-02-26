import { useMutation, useQuery } from '@tanstack/react-query'
import availabilityApiRequest from '../apis/availability.api'

export const useAddAvailabilityMutation = () => {
  return useMutation({
    mutationFn: availabilityApiRequest.addAvailability
  })
}

export const useGetAvailabilityQuery = (userId: number, matchId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['availability', userId, matchId],
    queryFn: () => availabilityApiRequest.getAvailability(userId, matchId),
    enabled: enabled && !!userId && !!matchId
  })
}

export const useFindCommonDateMutation = () => {
  return useMutation({
    mutationFn: availabilityApiRequest.findCommonDate
  })
}

export const useGetDateQuery = (matchId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['date', matchId],
    queryFn: () => availabilityApiRequest.getDate(matchId),
    enabled: enabled && !!matchId
  })
}

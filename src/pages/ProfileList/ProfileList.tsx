import { useGetAllProfilesQuery, useLikeProfileMutation } from '../../hooks/useProfile'
import { Link } from 'react-router-dom'
import path from '../../constants/path'
import { useContext, useState } from 'react'
import { AppContext } from '../../contexts/app.context'
import { toast } from 'react-toastify'

export default function ProfileList() {
  const { data, isLoading, error, refetch } = useGetAllProfilesQuery()
  const { profile: currentUser } = useContext(AppContext)
  const likeProfileMutation = useLikeProfileMutation()
  const [matchedUserId, setMatchedUserId] = useState<number | null>(null)

  const handleLike = async (toUserId: number) => {
    if (!currentUser) {
      toast.error('Vui lòng đăng nhập để like!')
      return
    }

    if (currentUser.id === toUserId) {
      toast.error('Bạn không thể like chính mình!')
      return
    }

    try {
      const result = await likeProfileMutation.mutateAsync({
        toUserId,
        fromUserId: currentUser.id
      })

      if (result.data.data.isMatch) {
        setMatchedUserId(toUserId)
        toast.success("It's a Match!")
        setTimeout(() => setMatchedUserId(null), 3000)
      } else {
        toast.success('Đã like profile!')
      }

      refetch()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Có lỗi xảy ra khi like!'
      toast.error(errorMessage)
    }
  }

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-12'>
        <div className='text-center'>
          <div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
          <p className='mt-4 text-gray-600'>Đang tải danh sách profiles...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='container mx-auto px-4 py-12'>
        <div className='text-center'>
          <p className='text-red-500 text-lg'>Có lỗi xảy ra khi tải danh sách profiles!</p>
        </div>
      </div>
    )
  }

  const profiles = data?.data.data || []

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold text-gray-800 mb-6'>Danh Sách Profiles</h1>

      {profiles.length === 0 ? (
        <div className='text-center py-12'>
          <p className='text-gray-600 text-lg'>Chưa có profile nào.</p>
          <Link
            to={path.profile}
            className='inline-block mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition'
          >
            Tạo Profile Đầu Tiên
          </Link>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition ${
                matchedUserId === profile.id ? 'ring-4 ring-pink-500 animate-pulse' : ''
              }`}
            >
              <div className='flex items-center gap-4 mb-4'>
                <div className='w-16 h-16 bg-linear-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold'>
                  {profile.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className='text-xl font-semibold text-gray-800'>{profile.name}</h3>
                  <p className='text-gray-600'>
                    {profile.age} tuổi •{' '}
                    {profile.gender === 'male' ? 'Nam' : profile.gender === 'female' ? 'Nữ' : 'Khác'}
                  </p>
                </div>
              </div>

              {profile.bio && <p className='text-gray-700 mb-4 line-clamp-3'>{profile.bio}</p>}

              {matchedUserId === profile.id && (
                <div className='mb-4 p-3 bg-pink-100 rounded-lg text-center'>
                  <p className='text-pink-600 font-bold text-lg'>It&apos;s a Match!</p>
                </div>
              )}

              <div className='flex items-center gap-2 pt-4 border-t border-gray-200'>
                <Link
                  to={`/profile/${profile.id}`}
                  className='flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm font-medium text-center'
                >
                  Xem Chi Tiết
                </Link>
                {currentUser && currentUser.id !== profile.id && (
                  <button
                    onClick={() => handleLike(profile.id)}
                    disabled={likeProfileMutation.isPending}
                    className='px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition text-sm font-medium disabled:bg-gray-400'
                  >
                    Like
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

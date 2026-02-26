import { useParams, Link, useNavigate } from 'react-router-dom'
import { useGetProfileByIdQuery, useLikeProfileMutation } from '../../hooks/useProfile'
import path from '../../constants/path'
import { useContext, useState } from 'react'
import { AppContext } from '../../contexts/app.context'
import { toast } from 'react-toastify'

export default function ProfileDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const profileId = Number(id)
  const { profile: currentUser } = useContext(AppContext)
  const likeProfileMutation = useLikeProfileMutation()
  const [showMatch, setShowMatch] = useState(false)

  const { data, isLoading, error } = useGetProfileByIdQuery(profileId, !!id)

  const handleLike = async () => {
    if (!currentUser) {
      toast.error('Vui lòng đăng nhập để like!')
      navigate(path.login)
      return
    }

    if (currentUser.id === profileId) {
      toast.error('Bạn không thể like chính mình!')
      return
    }

    try {
      const result = await likeProfileMutation.mutateAsync({
        toUserId: profileId,
        fromUserId: currentUser.id
      })

      if (result.data.data.isMatch) {
        setShowMatch(true)
        toast.success("It's a Match!")
        setTimeout(() => {
          setShowMatch(false)
          navigate(path.profileList)
        }, 3000)
      } else {
        toast.success('Đã like profile!')
        setTimeout(() => {
          navigate(path.profileList)
        }, 1000)
      }
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
          <p className='mt-4 text-gray-600'>Đang tải thông tin profile...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className='container mx-auto px-4 py-12'>
        <div className='text-center'>
          <p className='text-red-500 text-lg mb-4'>Không tìm thấy profile này!</p>
          <button
            onClick={() => navigate(path.profileList)}
            className='px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition'
          >
            Quay Lại Danh Sách
          </button>
        </div>
      </div>
    )
  }

  const profile = data.data.data

  return (
    <div className='container mx-auto px-4 py-8 max-w-2xl'>
      <div className='mb-4'>
        <Link to={path.profileList} className='inline-flex items-center text-blue-500 hover:text-blue-600 transition'>
          <svg className='w-5 h-5 mr-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
          </svg>
          Quay lại danh sách
        </Link>
      </div>

      <div className={`bg-white rounded-lg shadow-md p-8 ${showMatch ? 'ring-4 ring-pink-500 animate-pulse' : ''}`}>
        {showMatch && (
          <div className='mb-6 p-4 bg-pink-100 rounded-lg text-center'>
            <p className='text-pink-600 font-bold text-2xl'>It&apos;s a Match!</p>
            <p className='text-pink-500 mt-2'>Đang chuyển về danh sách...</p>
          </div>
        )}

        <div className='flex flex-col items-center mb-8'>
          <div className='w-32 h-32 bg-linear-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-5xl font-bold mb-4'>
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <h2 className='text-2xl font-semibold text-gray-800'>{profile.name}</h2>
          <p className='text-gray-600 mt-1'>
            {profile.age} tuổi • {profile.gender === 'male' ? 'Nam' : profile.gender === 'female' ? 'Nữ' : 'Khác'}
          </p>
        </div>

        <div className='space-y-6'>
          <div className='border-t border-gray-200 pt-6'>
            <h3 className='text-lg font-semibold text-gray-800 mb-2'>Email</h3>
            <p className='text-gray-700'>{profile.email}</p>
          </div>

          {profile.bio && (
            <div className='border-t border-gray-200 pt-6'>
              <h3 className='text-lg font-semibold text-gray-800 mb-2'>Giới Thiệu</h3>
              <p className='text-gray-700 whitespace-pre-wrap'>{profile.bio}</p>
            </div>
          )}

          <div className='border-t border-gray-200 pt-6'>
            <h3 className='text-lg font-semibold text-gray-800 mb-2'>Ngày Tạo</h3>
            <p className='text-gray-700'>
              {new Date(profile.created_at).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>

        <div className='mt-8 pt-6 border-t border-gray-200'>
          {currentUser && currentUser.id !== profile.id ? (
            <button
              onClick={handleLike}
              disabled={likeProfileMutation.isPending || showMatch}
              className='w-full py-3 bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600 transition disabled:bg-gray-400'
            >
              {likeProfileMutation.isPending ? 'Đang like...' : 'Like Profile'}
            </button>
          ) : (
            <div className='text-center text-gray-500'>Đây là profile của bạn</div>
          )}
        </div>
      </div>
    </div>
  )
}

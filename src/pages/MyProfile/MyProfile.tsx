import { useContext } from 'react'
import { AppContext } from '../../contexts/app.context'
import { useGetProfileByIdQuery } from '../../hooks/useProfile'
import { Link, Navigate } from 'react-router-dom'
import path from '../../constants/path'

export default function MyProfile() {
  const { isAuthenticated, profile: contextProfile } = useContext(AppContext)

  if (!isAuthenticated || !contextProfile) {
    return <Navigate to={path.login} replace />
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data, isLoading, error } = useGetProfileByIdQuery(contextProfile.id)

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

  if (error) {
    return (
      <div className='container mx-auto px-4 py-12'>
        <div className='text-center'>
          <p className='text-red-500 text-lg'>Có lỗi xảy ra khi tải thông tin profile!</p>
        </div>
      </div>
    )
  }

  const profile = data?.data.data

  if (!profile) {
    return (
      <div className='container mx-auto px-4 py-12'>
        <div className='text-center'>
          <p className='text-gray-600 text-lg'>Không tìm thấy thông tin profile.</p>
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 py-8 max-w-2xl'>
      <div className='bg-white rounded-lg shadow-md p-8'>
        <div className='flex items-center justify-between mb-6'>
          <h1 className='text-3xl font-bold text-gray-800'>Profile Của Tôi</h1>
          <Link
            to={path.profileList}
            className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm font-medium'
          >
            Xem Danh Sách
          </Link>
        </div>

        <div className='flex flex-col items-center mb-8'>
          <div className='w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-5xl font-bold mb-4'>
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

          <div className='border-t border-gray-200 pt-6'>
            <h3 className='text-lg font-semibold text-gray-800 mb-2'>ID</h3>
            <p className='text-gray-700 font-mono'>#{profile.id}</p>
          </div>
        </div>

        <div className='mt-8 pt-6 border-t border-gray-200'>
          <div className='bg-blue-50 rounded-lg p-4'>
            <p className='text-sm text-blue-800'>
              <strong>Gợi ý:</strong> Bạn có thể xem danh sách profiles khác và bắt đầu kết nối!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

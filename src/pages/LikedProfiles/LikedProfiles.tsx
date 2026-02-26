import { useContext } from 'react'
import { AppContext } from '../../contexts/app.context'
import { useGetLikedProfilesQuery } from '../../hooks/useProfile'
import { Link, Navigate } from 'react-router-dom'
import path from '../../constants/path'

export default function LikedProfiles() {
  const { isAuthenticated, profile: currentUser } = useContext(AppContext)

  if (!isAuthenticated || !currentUser) {
    return <Navigate to={path.login} replace />
  }

  const { data, isLoading, error } = useGetLikedProfilesQuery(currentUser.id)

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-12'>
        <div className='text-center'>
          <div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
          <p className='mt-4 text-gray-600'>Đang tải danh sách profiles đã like...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='container mx-auto px-4 py-12'>
        <div className='text-center'>
          <p className='text-red-500 text-lg'>Có lỗi xảy ra khi tải danh sách!</p>
        </div>
      </div>
    )
  }

  const likedProfiles = data?.data.data || []

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-3xl font-bold text-gray-800'>Profiles Đã Like</h1>
        <Link
          to={path.profileList}
          className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm font-medium'
        >
          Tìm thêm người
        </Link>
      </div>

      {likedProfiles.length === 0 ? (
        <div className='text-center py-12'>
          <p className='text-gray-600 text-lg mb-4'>Bạn chưa like profile nào.</p>
          <p className='text-gray-500 mb-6'>Hãy xem danh sách profiles và like những người bạn thích!</p>
          <Link
            to={path.profileList}
            className='inline-block px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition'
          >
            Xem Danh Sách Profiles
          </Link>
        </div>
      ) : (
        <>
          <div className='mb-4 p-4 bg-blue-50 rounded-lg'>
            <p className='text-blue-600 font-medium'>
              Bạn đã like <strong>{likedProfiles.length}</strong> profile{likedProfiles.length > 1 ? 's' : ''}!
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {likedProfiles.map((item) => (
              <div key={item.like_id} className='bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition'>
                <div className='flex items-center gap-4 mb-4'>
                  <div className='w-16 h-16 bg-linear-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white text-2xl font-bold'>
                    {item.profile.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className='text-xl font-semibold text-gray-800'>{item.profile.name}</h3>
                    <p className='text-gray-600'>
                      {item.profile.age} tuổi •{' '}
                      {item.profile.gender === 'male' ? 'Nam' : item.profile.gender === 'female' ? 'Nữ' : 'Khác'}
                    </p>
                  </div>
                </div>

                {item.profile.bio && <p className='text-gray-700 mb-4 line-clamp-2'>{item.profile.bio}</p>}

                <div className='mb-4 p-2 bg-blue-100 rounded text-center'>
                  <p className='text-blue-600 text-sm font-medium'>
                    Liked {new Date(item.liked_at).toLocaleDateString('vi-VN')}
                  </p>
                </div>

                <Link
                  to={`/profile/${item.profile.id}`}
                  className='block w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm font-medium text-center'
                >
                  Xem Profile
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

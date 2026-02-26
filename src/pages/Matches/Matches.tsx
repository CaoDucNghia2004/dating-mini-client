import { useContext } from 'react'
import { AppContext } from '../../contexts/app.context'
import { useGetMatchesQuery } from '../../hooks/useProfile'
import { useGetDateQuery } from '../../hooks/useAvailability'
import { Link, Navigate } from 'react-router-dom'
import path from '../../constants/path'

function MatchCard({ match }: { match: any }) {
  const { data: dateData } = useGetDateQuery(match.match_id, true)
  const hasDate = dateData?.data.data

  return (
    <div key={match.match_id} className='bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition'>
      <div className='flex items-center gap-4 mb-4'>
        <div className='w-16 h-16 bg-linear-to-br from-pink-400 to-red-500 rounded-full flex items-center justify-center text-white text-2xl font-bold'>
          {match.profile.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className='text-xl font-semibold text-gray-800'>{match.profile.name}</h3>
          <p className='text-gray-600'>
            {match.profile.age} tuổi •{' '}
            {match.profile.gender === 'male' ? 'Nam' : match.profile.gender === 'female' ? 'Nữ' : 'Khác'}
          </p>
        </div>
      </div>

      {match.profile.bio && <p className='text-gray-700 mb-4 line-clamp-2'>{match.profile.bio}</p>}

      <div className='mb-4 p-2 bg-pink-100 rounded text-center'>
        <p className='text-pink-600 text-sm font-medium'>
          Matched {new Date(match.matched_at).toLocaleDateString('vi-VN')}
        </p>
      </div>

      {hasDate && (
        <div className='mb-4 p-3 bg-green-50 rounded-lg border border-green-200'>
          <p className='text-green-700 font-semibold text-sm mb-2'>Đã có lịch hẹn:</p>
          <p className='text-gray-700 text-sm'>{new Date(hasDate.date).toLocaleDateString('vi-VN')}</p>
          <p className='text-gray-700 text-sm'>
            {hasDate.start_time} - {hasDate.end_time}
          </p>
        </div>
      )}

      <div className='flex flex-col gap-2'>
        <Link
          to={`/profile/${match.profile.id}`}
          className='w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm font-medium text-center'
        >
          Xem Profile
        </Link>
        {hasDate ? (
          <Link
            to={`/date-result/${match.match_id}`}
            className='w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition text-sm font-medium text-center'
          >
            Xem Lịch Hẹn
          </Link>
        ) : (
          <Link
            to={`/availability/${match.match_id}`}
            className='w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition text-sm font-medium text-center'
          >
            Chọn Lịch Hẹn
          </Link>
        )}
      </div>
    </div>
  )
}

export default function Matches() {
  const { isAuthenticated, profile: currentUser } = useContext(AppContext)

  if (!isAuthenticated || !currentUser) {
    return <Navigate to={path.login} replace />
  }

  const { data, isLoading, error } = useGetMatchesQuery(currentUser.id)

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-12'>
        <div className='text-center'>
          <div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
          <p className='mt-4 text-gray-600'>Đang tải danh sách matches...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='container mx-auto px-4 py-12'>
        <div className='text-center'>
          <p className='text-red-500 text-lg'>Có lỗi xảy ra khi tải danh sách matches!</p>
        </div>
      </div>
    )
  }

  const matches = data?.data.data || []

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-3xl font-bold text-gray-800'>Matches của tôi</h1>
        <Link
          to={path.profileList}
          className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm font-medium'
        >
          Tìm thêm người
        </Link>
      </div>

      {matches.length === 0 ? (
        <div className='text-center py-12'>
          <p className='text-gray-600 text-lg mb-4'>Bạn chưa có match nào.</p>
          <p className='text-gray-500 mb-6'>Hãy like các profile khác để tìm match!</p>
          <Link
            to={path.profileList}
            className='inline-block px-6 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition'
          >
            Xem Danh Sách Profiles
          </Link>
        </div>
      ) : (
        <>
          <div className='mb-4 p-4 bg-pink-50 rounded-lg'>
            <p className='text-pink-600 font-medium'>
              Bạn có <strong>{matches.length}</strong> match{matches.length > 1 ? 'es' : ''}!
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {matches.map((match) => (
              <MatchCard key={match.match_id} match={match} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

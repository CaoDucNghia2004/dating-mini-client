import { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate, Navigate, Link } from 'react-router-dom'
import { AppContext } from '../../contexts/app.context'
import { useGetDateQuery, useFindCommonDateMutation } from '../../hooks/useAvailability'
import { toast } from 'react-toastify'
import path from '../../constants/path'

export default function DateResult() {
  const { matchId } = useParams<{ matchId: string }>()
  const navigate = useNavigate()
  const { isAuthenticated, profile: currentUser } = useContext(AppContext)
  const matchIdNum = Number(matchId)
  const [hasTriedFinding, setHasTriedFinding] = useState(false)

  const { data: dateData, isLoading, error, refetch } = useGetDateQuery(matchIdNum, !!matchId)
  const findCommonDateMutation = useFindCommonDateMutation()

  if (!isAuthenticated || !currentUser) {
    return <Navigate to={path.login} replace />
  }

  const handleFindCommonDate = async () => {
    try {
      const result = await findCommonDateMutation.mutateAsync({
        match_id: matchIdNum
      })

      setHasTriedFinding(true)

      if (result.data.data.found) {
        toast.success('Đã tìm thấy lịch hẹn chung!')
        refetch()
      } else {
        toast.warning('Chưa tìm được thời gian trùng. Vui lòng chọn lại.')
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Có lỗi xảy ra!'
      toast.error(errorMessage)
      setHasTriedFinding(true)
    }
  }

  useEffect(() => {
    if (!isLoading && !dateData && !hasTriedFinding && !findCommonDateMutation.isPending) {
      handleFindCommonDate()
    }
  }, [isLoading, dateData, hasTriedFinding])

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-12'>
        <div className='text-center'>
          <div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
          <p className='mt-4 text-gray-600'>Đang kiểm tra lịch hẹn...</p>
        </div>
      </div>
    )
  }

  const dateResult = dateData?.data.data

  return (
    <div className='container mx-auto px-4 py-8 max-w-2xl'>
      <div className='bg-white rounded-lg shadow-md p-8'>
        <h1 className='text-3xl font-bold text-gray-800 mb-6 text-center'>Kết Quả Lịch Hẹn</h1>

        {dateResult ? (
          <div className='text-center'>
            <div className='mb-6'>
              <h2 className='text-2xl font-bold text-green-600 mb-4'>Hai bạn có date hẹn vào:</h2>
            </div>

            <div className='bg-green-50 rounded-lg p-6 mb-6'>
              <div className='mb-4'>
                <p className='text-gray-600 text-sm mb-1'>Ngày</p>
                <p className='text-2xl font-bold text-gray-800'>
                  {new Date(dateResult.date).toLocaleDateString('vi-VN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              <div className='flex items-center justify-center gap-4'>
                <div>
                  <p className='text-gray-600 text-sm mb-1'>Từ</p>
                  <p className='text-xl font-bold text-green-600'>{dateResult.start_time}</p>
                </div>
                <span className='text-2xl text-gray-400'>→</span>
                <div>
                  <p className='text-gray-600 text-sm mb-1'>Đến</p>
                  <p className='text-xl font-bold text-green-600'>{dateResult.end_time}</p>
                </div>
              </div>
            </div>

            <div className='space-y-3'>
              <Link
                to={path.matches}
                className='block w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold'
              >
                Quay Về Matches
              </Link>
              <button
                onClick={() => navigate(`/availability/${matchId}`)}
                className='w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium'
              >
                Thêm Thời Gian Rảnh
              </button>
            </div>
          </div>
        ) : (
          <div className='text-center'>
            <div className='mb-6'>
              <h2 className='text-2xl font-bold text-orange-600 mb-4'>Chưa tìm được thời gian trùng</h2>
              <p className='text-gray-600'>Vui lòng chọn thêm thời gian rảnh hoặc yêu cầu người kia chọn thêm.</p>
            </div>

            <div className='bg-orange-50 rounded-lg p-6 mb-6'>
              <p className='text-orange-600 font-medium'>
                Mẹo: Hãy chọn nhiều slot thời gian khác nhau để tăng khả năng tìm được lịch hẹn chung!
              </p>
            </div>

            <div className='space-y-3'>
              <button
                onClick={() => navigate(`/availability/${matchId}`)}
                className='w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold'
              >
                Chọn Thời Gian Rảnh
              </button>
              <button
                onClick={handleFindCommonDate}
                disabled={findCommonDateMutation.isPending}
                className='w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium disabled:bg-gray-400'
              >
                {findCommonDateMutation.isPending ? 'Đang tìm...' : 'Thử Tìm Lại'}
              </button>
              <Link
                to={path.matches}
                className='block w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium'
              >
                Quay Về Matches
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

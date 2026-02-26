import { useContext, useState } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { AppContext } from '../../contexts/app.context'
import { useAddAvailabilityMutation, useGetAvailabilityQuery } from '../../hooks/useAvailability'
import { toast } from 'react-toastify'
import path from '../../constants/path'

interface AvailabilitySlot {
  date: string
  start_time: string
  end_time: string
}

export default function AvailabilitySelection() {
  const { matchId } = useParams<{ matchId: string }>()
  const navigate = useNavigate()
  const { isAuthenticated, profile: currentUser } = useContext(AppContext)
  const matchIdNum = Number(matchId)

  const [slots, setSlots] = useState<AvailabilitySlot[]>([{ date: '', start_time: '', end_time: '' }])

  const addAvailabilityMutation = useAddAvailabilityMutation()
  const { data: existingAvailability } = useGetAvailabilityQuery(
    currentUser?.id || 0,
    matchIdNum,
    !!currentUser && !!matchId
  )

  if (!isAuthenticated || !currentUser) {
    return <Navigate to={path.login} replace />
  }

  const today = new Date()
  const minDate = today.toISOString().split('T')[0]
  const maxDate = new Date(today.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const handleAddSlot = () => {
    setSlots([...slots, { date: '', start_time: '', end_time: '' }])
  }

  const handleRemoveSlot = (index: number) => {
    if (slots.length > 1) {
      setSlots(slots.filter((_, i) => i !== index))
    }
  }

  const handleSlotChange = (index: number, field: keyof AvailabilitySlot, value: string) => {
    const newSlots = [...slots]
    newSlots[index][field] = value
    setSlots(newSlots)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validSlots = slots.filter((slot) => slot.date && slot.start_time && slot.end_time)

    if (validSlots.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 slot thời gian!')
      return
    }

    for (const slot of validSlots) {
      if (slot.start_time >= slot.end_time) {
        toast.error('Giờ bắt đầu phải nhỏ hơn giờ kết thúc!')
        return
      }
    }

    try {
      await addAvailabilityMutation.mutateAsync({
        user_id: currentUser.id,
        match_id: matchIdNum,
        availabilities: validSlots
      })

      toast.success('Đã lưu thời gian rảnh!')
      navigate(`/date-result/${matchId}`)
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Có lỗi xảy ra!'
      toast.error(errorMessage)
    }
  }

  const hasExistingAvailability = existingAvailability?.data.data && existingAvailability.data.data.length > 0
  const existingSlots = existingAvailability?.data.data || []

  return (
    <div className='container mx-auto px-4 py-8 max-w-3xl'>
      <div className='bg-white rounded-lg shadow-md p-8'>
        <h1 className='text-3xl font-bold text-gray-800 mb-2'>Chọn Thời Gian Rảnh</h1>
        <p className='text-gray-600 mb-6'>Chọn các khoảng thời gian bạn rảnh trong 3 tuần tới</p>

        {hasExistingAvailability && (
          <div className='mb-6'>
            <div className='p-4 bg-green-50 rounded-lg mb-4'>
              <p className='text-green-600 font-medium mb-3'>Bạn đã chọn {existingSlots.length} slot thời gian:</p>
              <div className='space-y-2'>
                {existingSlots.map((slot, index) => (
                  <div
                    key={slot.id}
                    className='flex items-center gap-3 text-sm bg-white p-3 rounded border border-green-200'
                  >
                    <span className='font-semibold text-green-700'>#{index + 1}</span>
                    <span className='text-gray-700'>{new Date(slot.date).toLocaleDateString('vi-VN')}</span>
                    <span className='text-gray-500'>•</span>
                    <span className='text-gray-700'>
                      {slot.start_time} - {slot.end_time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <p className='text-green-600 text-sm'>Bạn có thể thêm slot mới bên dưới</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className='space-y-4 mb-6'>
            {slots.map((slot, index) => (
              <div key={index} className='p-4 border border-gray-200 rounded-lg'>
                <div className='flex items-center justify-between mb-3'>
                  <h3 className='font-semibold text-gray-700'>Slot {index + 1}</h3>
                  {slots.length > 1 && (
                    <button
                      type='button'
                      onClick={() => handleRemoveSlot(index)}
                      className='text-red-500 hover:text-red-600 text-sm'
                    >
                      Xóa
                    </button>
                  )}
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Ngày</label>
                    <input
                      type='date'
                      value={slot.date}
                      onChange={(e) => handleSlotChange(index, 'date', e.target.value)}
                      min={minDate}
                      max={maxDate}
                      className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                      required
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Từ giờ</label>
                    <input
                      type='time'
                      value={slot.start_time}
                      onChange={(e) => handleSlotChange(index, 'start_time', e.target.value)}
                      className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                      required
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Đến giờ</label>
                    <input
                      type='time'
                      value={slot.end_time}
                      onChange={(e) => handleSlotChange(index, 'end_time', e.target.value)}
                      className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type='button'
            onClick={handleAddSlot}
            className='w-full mb-4 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition font-medium'
          >
            + Thêm Slot
          </button>

          <div className='flex gap-3'>
            <button
              type='button'
              onClick={() => navigate(path.matches)}
              className='flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-semibold'
            >
              Quay Lại
            </button>
            <button
              type='submit'
              disabled={addAvailabilityMutation.isPending}
              className='flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold disabled:bg-gray-400'
            >
              {addAvailabilityMutation.isPending ? 'Đang lưu...' : 'Lưu Thời Gian'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

import { useForm } from 'react-hook-form'
import { CreateProfileBody, type CreateProfileBodyType } from '../../schemaValidations/profile.schema'
import { yupResolver } from '@hookform/resolvers/yup'
import { useCreateProfileMutation } from '../../hooks/useProfile'
import { useNavigate, Link } from 'react-router-dom'
import path from '../../constants/path'
import { toast } from 'react-toastify'

export default function CreateProfile() {
  const navigate = useNavigate()
  const createProfileMutation = useCreateProfileMutation()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateProfileBodyType>({
    resolver: yupResolver(CreateProfileBody),
    defaultValues: {
      name: '',
      age: 18,
      gender: 'male',
      bio: '',
      email: '',
      password: ''
    }
  })

  const onSubmit = handleSubmit(async (data) => {
    try {
      const result = await createProfileMutation.mutateAsync(data)
      console.log('Tạo profile thành công:', result)
      toast.success('Tạo profile thành công! Bạn có thể đăng nhập ngay.')
      navigate(path.login)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Lỗi:', error)
      const errorMessage = error?.response?.data?.message || 'Có lỗi xảy ra!'
      toast.error(errorMessage)
    }
  })

  return (
    <div className='container mx-auto px-4 py-8 max-w-md'>
      <div className='bg-white rounded-lg shadow-md p-6'>
        <h2 className='text-2xl font-semibold text-gray-800 mb-6 text-center'>Tạo Profile</h2>

        <form onSubmit={onSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Tên</label>
            <input
              type='text'
              {...register('name')}
              placeholder='Nhập tên của bạn'
              className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            {errors.name && <p className='text-red-500 text-sm mt-1'>{errors.name.message}</p>}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Tuổi</label>
            <input
              type='number'
              {...register('age', { valueAsNumber: true })}
              placeholder='Nhập tuổi'
              className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            {errors.age && <p className='text-red-500 text-sm mt-1'>{errors.age.message}</p>}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Giới tính</label>
            <select
              {...register('gender')}
              className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value='male'>Nam</option>
              <option value='female'>Nữ</option>
              <option value='other'>Khác</option>
            </select>
            {errors.gender && <p className='text-red-500 text-sm mt-1'>{errors.gender.message}</p>}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Bio (Tùy chọn)</label>
            <textarea
              {...register('bio')}
              placeholder='Giới thiệu về bản thân...'
              rows={3}
              className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            {errors.bio && <p className='text-red-500 text-sm mt-1'>{errors.bio.message}</p>}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
            <input
              type='email'
              {...register('email')}
              placeholder='example@email.com'
              className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            {errors.email && <p className='text-red-500 text-sm mt-1'>{errors.email.message}</p>}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Mật khẩu</label>
            <input
              type='password'
              {...register('password')}
              placeholder='Nhập mật khẩu (tối thiểu 6 ký tự)'
              className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            {errors.password && <p className='text-red-500 text-sm mt-1'>{errors.password.message}</p>}
          </div>

          <button
            type='submit'
            disabled={createProfileMutation.isPending}
            className='w-full bg-blue-500 text-white py-2 rounded font-medium hover:bg-blue-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed'
          >
            {createProfileMutation.isPending ? 'Đang tạo...' : 'Tạo Profile'}
          </button>
        </form>

        <p className='text-center text-sm text-gray-600 mt-4'>
          Đã có tài khoản?{' '}
          <Link to={path.login} className='text-blue-500 hover:underline'>
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  )
}

import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { LoginBody, type LoginBodyType } from '../../schemaValidations/profile.schema'
import { yupResolver } from '@hookform/resolvers/yup'
import { useLoginMutation } from '../../hooks/useProfile'
import { useNavigate, Link } from 'react-router-dom'
import path from '../../constants/path'
import { toast } from 'react-toastify'
import { AppContext } from '../../contexts/app.context'
import { setAccessTokenToLS, setProfileToLS } from '../../utils/auth'

export default function Login() {
  const navigate = useNavigate()
  const loginMutation = useLoginMutation()
  const { setIsAuthenticated, setProfile } = useContext(AppContext)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginBodyType>({
    resolver: yupResolver(LoginBody),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = handleSubmit(async (data) => {
    try {
      const result = await loginMutation.mutateAsync(data)
      const { access_token, ...profile } = result.data.data

      setAccessTokenToLS(access_token)
      setProfileToLS(profile)

      setIsAuthenticated(true)
      setProfile(profile)

      toast.success('Đăng nhập thành công!')
      navigate(path.home)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Lỗi:', error)
      const errorMessage = error?.response?.data?.message || 'Đăng nhập thất bại!'
      toast.error(errorMessage)
    }
  })

  return (
    <div className='container mx-auto px-4 py-8 max-w-md'>
      <div className='bg-white rounded-lg shadow-md p-6'>
        <h2 className='text-2xl font-semibold text-gray-800 mb-6 text-center'>Đăng Nhập</h2>

        <form onSubmit={onSubmit} className='space-y-4'>
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
              placeholder='Nhập mật khẩu'
              className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            {errors.password && <p className='text-red-500 text-sm mt-1'>{errors.password.message}</p>}
          </div>

          <button
            type='submit'
            disabled={loginMutation.isPending}
            className='w-full bg-blue-500 text-white py-2 rounded font-medium hover:bg-blue-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed'
          >
            {loginMutation.isPending ? 'Đang đăng nhập...' : 'Đăng Nhập'}
          </button>
        </form>

        <p className='text-center text-sm text-gray-600 mt-4'>
          Chưa có tài khoản?{' '}
          <Link to={path.profile} className='text-blue-500 hover:underline'>
            Tạo profile
          </Link>
        </p>
      </div>
    </div>
  )
}

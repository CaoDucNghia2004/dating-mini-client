import Footer from '../../components/Footer'
import Header from '../../components/Header'

interface Props {
  children?: React.ReactNode
}

export default function MainLayout({ children }: Props) {
  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <main className='flex-1 bg-gray-50'>{children}</main>
      <Footer />
    </div>
  )
}

import { useRoutes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import path from './constants/path'
import Profile from './pages/Profile'
import Login from './pages/Login'
import ProfileList from './pages/ProfileList'
import MyProfile from './pages/MyProfile'
import ProfileDetail from './pages/ProfileDetail'
import Matches from './pages/Matches'
import LikedProfiles from './pages/LikedProfiles'
import AvailabilitySelection from './pages/AvailabilitySelection'
import DateResult from './pages/DateResult'

export default function useRouteElements() {
  const routerElement = useRoutes([
    {
      path: '',
      index: true,
      element: (
        <MainLayout>
          <Home />
        </MainLayout>
      )
    },
    {
      path: path.profile,
      element: (
        <MainLayout>
          <Profile />
        </MainLayout>
      )
    },
    {
      path: path.login,
      element: (
        <MainLayout>
          <Login />
        </MainLayout>
      )
    },
    {
      path: path.profileList,
      element: (
        <MainLayout>
          <ProfileList />
        </MainLayout>
      )
    },
    {
      path: path.myProfile,
      element: (
        <MainLayout>
          <MyProfile />
        </MainLayout>
      )
    },
    {
      path: path.likedProfiles,
      element: (
        <MainLayout>
          <LikedProfiles />
        </MainLayout>
      )
    },
    {
      path: path.matches,
      element: (
        <MainLayout>
          <Matches />
        </MainLayout>
      )
    },
    {
      path: '/profile/:id',
      element: (
        <MainLayout>
          <ProfileDetail />
        </MainLayout>
      )
    },
    {
      path: '/availability/:matchId',
      element: (
        <MainLayout>
          <AvailabilitySelection />
        </MainLayout>
      )
    },
    {
      path: '/date-result/:matchId',
      element: (
        <MainLayout>
          <DateResult />
        </MainLayout>
      )
    }
  ])
  return routerElement
}

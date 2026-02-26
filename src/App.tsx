import './App.css'
import useRouteElements from './useRouteElements'

function App() {
  const routerElements = useRouteElements()
  return <>{routerElements}</>
}

export default App

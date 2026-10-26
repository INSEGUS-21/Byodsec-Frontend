
import './App.css'
import { Routes, Route } from "react-router-dom";
import Home from './screens/Home.jsx';
import Login from './screens/Login.jsx';
import SignUp from './screens/SignUp.jsx';
import Reissue from './screens/Reissue.jsx'
import Revoke from './screens/Revoke.jsx'

export default function App(){
  return (
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/sign-up' element={<SignUp/>}/>
      <Route path='/reissue' element={<Reissue/>}/>
      <Route path='/revoke' element={<Revoke/>}/>
    </Routes>
  )
}

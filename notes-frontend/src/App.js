import './App.css';
import {BrowserRouter as Router,Routes,Route, Navigate} from 'react-router-dom';
import LandingPage from './routes/Landing';
import Signup from './routes/Signup';
import Login from './routes/Login';
import Home from './routes/Home';
import File from './routes/File';
import {useCookies} from 'react-cookie';

function App() {
  const [cookie,setCookie]=useCookies(["noteToken"]);
  return (
    <Router>
    {cookie.noteToken?
      <Routes>
        <Route path='*' element={<Navigate to="/" replace/>}/>
        <Route path='/landing' element={<LandingPage/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/' element={<Home/>}/>
        <Route path='/file/:id/:name' element={<File/>}/>
      </Routes>:
      <Routes>
        <Route path="*" element={<Navigate to="/" replace/>} />
        <Route path='/signup' element={<Signup/>}/>
        <Route path='login'  element={<Login/>}/>
        <Route path='/' element={<LandingPage/>}/>
      </Routes>
    }
    </Router>
  );
}

export default App;

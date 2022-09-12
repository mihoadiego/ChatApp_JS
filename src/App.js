import './App.scss';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'; // v6 here

import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Chat from './components/Chat/Chat';
import NotFound from './components/NotFound/NotFound';
import { socketIoOptions, webServiceAPI } from './utils/helpers'; // kokob added this line
import {io} from 'socket.io-client' // kokob added this line
import {library} from '@fortawesome/fontawesome-svg-core';
import {faSmile, faImage} from '@fortawesome/free-regular-svg-icons';
import {faSpinner, faEllipsisV, faUserPlus, faSignOutAlt, faTrash, faCaretDown, faUpload, faTimes, faBell} from '@fortawesome/free-solid-svg-icons';

import { useSelector } from 'react-redux';

library.add(faSmile, faImage, faSpinner, faEllipsisV, faUserPlus, faSignOutAlt, faTrash, faCaretDown, faUpload, faTimes, faBell)

const ProtectedRoute = ({children, isLoggedIn}) => {
  return (
      isLoggedIn 
      ? children 
      : <Navigate to="/login" /> 
  )
};



const socket = io(webServiceAPI.url, socketIoOptions); // kokob added this line
                                            
              

/**
 * ##################################################################################################################################
 * ##################################################################################################################################
 * ################################################################################################################################## 
 */

function App() {
  const isLoggedIn = useSelector(state=> state.authReducer.isLoggedIn)
  
  return (
    <Router> 
      <div className="App">
        {/* Routes in v6 = equivalent of Switch in v5 */}
        <Routes> 
          {/* for all non defined routes */}
          {/* props being ... element={<NotFound/>} in v6 ...  while component={NotFound} in v5  */}
          <Route path="*" element={<NotFound />} />
          {/* for precise (exact) "/" route -> exact props apparently not mandatory from now on v6, but we keep it anyway */}
          
            {/* <Route exact path={"/"} element={<Chat/>}/>     HAS BEEN XHANGED FOR THE HERE BELOW LINE, TO MANAGE AUTH PROTECTION*/}

          <Route path='/' element={<ProtectedRoute isLoggedIn={isLoggedIn}><Chat socketRef={socket}/*kokob aaded socketRef props*//></ProtectedRoute>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;

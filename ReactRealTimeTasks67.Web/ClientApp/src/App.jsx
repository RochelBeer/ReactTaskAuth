import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { ContextComponent } from './Context';
import Layout from './Layout';
import Signup from './Signup';
import Login from './Login';
import { Route, Routes } from 'react-router-dom';
import Logout from './Logout';
import Home from './Home';
import PrivateRoute from './PrivateRoute';


function App() {

    return (
        <ContextComponent>
            <Layout>
                <Routes>
                    <Route exact path='/' element={
                        <PrivateRoute>
                            <Home />
                        </PrivateRoute>} />
                    <Route exact path='/signup' element={<Signup />} />
                    <Route exact path='/login' element={<Login />} />
                    <Route exact path='/logout' element={<Logout />} />
                </Routes>
            </Layout>
        </ContextComponent>
    )
}
export default App;

// <Route exact path='/viewall' element={<ViewAll />} />
//                     <Route exact path='/logout' element={<Logout />} />
// <Route exact path='/' element={<Home />} />
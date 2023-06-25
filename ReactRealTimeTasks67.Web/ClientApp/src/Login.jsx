import axios from 'axios'
import { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "./Context";


const Login = () => {

    const [loginUser, setLoginUser] = useState({ email: '', password: '' });
    const [isValidLogin, setIsValidLogin] = useState(true);
    const { setUser } = useAuth();
    const navigate = useNavigate();

    const onTextChange = e => {
        const copy = { ...loginUser }
        copy[e.target.name] = e.target.value;
        setLoginUser(copy);
    }
    const onLogin = async e => {
        e.preventDefault();
        const { data } = await axios.post('/api/account/login', loginUser);
        const isValid = !!data;
        setIsValidLogin(isValid)
        if (isValid) {
            setUser(data);
            navigate("/");
        }      
    }

    return (
        <div
            className="row"
            style={{ minHeight: "80vh", display: "flex", alignItems: "center" }}
        >
            <div className="col-md-6 offset-md-3 bg-light p-4 rounded shadow">
                <h3>Log in to your account</h3>
                {!isValidLogin && <span class="text-danger">Invalid username/password. Please try again.</span>}
                <form>
                    <input
                        type="text"
                        name="email"
                        placeholder="Email"
                        className="form-control"
                        defaultValue=""
                        onChange={onTextChange}
                    />
                    <br />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="form-control"
                        defaultValue=""
                        onChange={onTextChange}
                    />
                    <br />
                    <button className="btn btn-primary" onClick={onLogin}>Login</button>
                </form>
                <Link to="/signup">Sign up for a new account</Link>
            </div>
        </div>
    )
}
export default Login
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import jwt from 'jwt-decode'
import Cookies from 'universal-cookie';
import { CircularProgress, Tooltip } from "@mui/material";

const Login = () => {
    const navigate = useNavigate();
    const cookies = new Cookies();
    const [loading, setLoading] = useState(false);
    const [login, setLogin] = useState({ email: "", password: "" })
    const handleChange = (e) => {
        setLogin({ ...login, [e.target.name]: e.target.value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        const { email, password } = login;
        const host = "http://10.17.50.150/backend";
        setLoading(true);
        axios.post(`${host}/api/token/`, {
            "email": email,
            "password": password
        }).then(function (response) {
            setLoading(false);
            const tokens = response.data;
            cookies.set('access', tokens.access, { path: '/' });
            cookies.set('refresh', tokens.refresh, { path: '/' });
            const decoded = jwt(tokens.access);
            (decoded.usertype === "PROFESSOR" ? navigate('/dashboard/professor') : navigate('/dashboard/student'))
        }).catch(function (error) {
            setLoading(false);
            if (error.response.status === 401) {
                alert("Invalid email or password")
            } else {
                alert("Something went wrong. Please try again later. If the problem persists, please contact admin.")
            }
        })
    }
    return (
        <div className={loading? "col-8 signup-container-loading": "col-8"} style={{ paddingTop: "190px" }}>
            {loading && <CircularProgress style={{width: '100px', height: '100px'}} className='progress-circle' />}
            <div className="container-screen mt-5">
                <h3>LOG IN</h3>
                <form onSubmit={handleSubmit} className="form-wrapper d-flex flex-column justify-content-center align-items-center">
                    <div className='full-input w-50 m-2'>
                        <label htmlFor="email" placeholder="Email">
                            Email* <Tooltip arrow title='Students must enter their kerberos email without department. Eg: cs1210001@iitd.ac.in' placement='top'><i className='fa-solid fa-circle-info'></i></Tooltip>
                        </label>
                        <input type="text" name="email" onChange={handleChange} value={login.email} />
                    </div>
                    <div className='full-input w-50 m-2'>
                        <label htmlFor="password" placeholder="Password">Password*</label>
                        <input type="password" name="password" onChange={handleChange} value={login.password} />
                    </div>
                    <button type='submit' disabled={login.email.length<1 || login.password.length<1} className="btn btn-dark btn-lg w-25 mt-2 px-2">Login</button>
                    {/* <Link to="/forgot-password" className="link-dark">Forgot Password?</Link> */}
                </form>
            </div>
        </div>
    )
}
export default Login
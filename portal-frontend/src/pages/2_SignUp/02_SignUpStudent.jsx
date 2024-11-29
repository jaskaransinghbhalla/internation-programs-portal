// Packages
import { React, useContext, useState } from "react";
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'universal-cookie';
import OTPInput from 'otp-input-react';
import { CircularProgress } from "@mui/material";
import PasswordStrengthBar from 'react-password-strength-bar'

// Files
// import Context from "../../contexts/Context";
// import Otpbox from './03_Otp-box.jsx'
import "./SignUp.css"

// Main Function
const cookies = new Cookies();
export default function Home() {
    const navigate = useNavigate();
    let formData = new FormData();
    // const context = useContext(Context);
    // const { finalOTP } = context;
    const [loading, setLoading] = useState(false);
    const validEntryNumber = new RegExp("^20[0-9]{2}[A-Z]{2}[A-Z0-9][0-9]{4}$");
    const [OTP, setOTP] = useState("");
    const [sign, setSign] = useState({ name: "", entry_number: "", password: "", cpassword: "", cgpa: "", program: "", resume: null, academic_transcript: null, deparment: "" })
    const state = (cookies.get('entry_number')) ? 2 : 1;
    const [page, setPage] = useState(state)
    const handleChange = (e) => {
        setSign({ ...sign, [e.target.name]: e.target.value })
    }
    const handleFileChange = (e) => {
        setSign({ ...sign, [e.target.name]: e.target.files[0] })
        formData.append(e.target.name, e.target.files[0]);
    }
    const handleClick1 = (e) => {
        if (sign.password !== sign.cpassword) {
            e.preventDefault()
            alert("Passwords do not match");
            return;
        } else {
            e.preventDefault()
            const { name, entry_number, password } = sign;
            const host = "http://10.17.50.150/backend";
            setLoading(true)
            axios.post(`${host}/api/register/student/basic/`, {
                "name": name,
                "entry_number": entry_number,
                "password": password
            }).then(function () {
                cookies.set('entry_number', entry_number, { path: '/' });
                setLoading(false)
                setPage(2)
            }).catch(function (error) {
                setLoading(false)
                if (error.response.data === "User already registered") {
                    navigate('/')
                    alert("You are already registered. Please login.")
                } else if (error.response.data === "User already verified") {
                    cookies.set('entry_number', entry_number, { path: '/' });
                    setPage(3)
                } else if (error.response.status < 500) {
                    alert(error.response.data);
                    setPage(1)
                } else {
                    alert("Something went wrong. Please try again later. If the problem persists, please contact admin.")
                    setPage(1)
                }
            })
        }
    }
    const handleClick2 = (e) => {
        e.preventDefault()
        // const { entry_number } = sign;
        // console.log(sign)
        const entry_number = cookies.get('entry_number', { path: '/' })
        const email = entry_number.slice(4, 7).toLowerCase() + entry_number.slice(2, 4) + entry_number.slice(7, 11) + "@iitd.ac.in";
        const host = "http://10.17.50.150/backend";
        setLoading(true)
        axios.post(`${host}/api/verify-otp/`, {
            "email": email,
            "otp": OTP
        }).then(function () {
            setLoading(false)
            setPage(3)
        }).catch(function (error) {
            setLoading(false)
            if (error.response.data === "User already registered") {
                navigate('/')
                alert("You are already registered. Please login.")
            } else if (error.response.data === "User already verified") {
                setPage(3)
            } else if (error.response.data === "OTP Expired") {
                alert("OTP has expired. Click on resend OTP button to get a new OTP");
            } else if (error.response.status < 500) {
                alert(error.response.data);
                setPage(2)
            } else {
                alert("Something went wrong. Please try again later. If the problem persists, please contact admin.")
                setPage(2)
            }
        })

    }
    const handleClick3 = () => {
        setPage(4);
    }
    const handleClick4 = (e) => {
        e.preventDefault()
        const formData = new FormData();
        const { program, cgpa, resume, academic_transcript } = sign;
        formData.append("entry_number", cookies.get('entry_number', { path: '/' }));
        formData.append("program", program);
        formData.append("cgpa", cgpa);
        formData.append("resume", resume);
        formData.append("academic_transcript", academic_transcript);
        const host = "http://10.17.50.150/backend";
        setLoading(true)
        axios.post(`${host}/api/register/student/additional/`, formData, {
            headers: {
                "Content-type": "multipart/form-data",
            },
        }).then(function () {
            setLoading(false)
            cookies.remove('entry_number', { path: '/' })
            navigate('/')
        }).catch(function (error) {
            setLoading(false)
            if (error.response.data === "Profile already exists") {
                navigate('/')
                alert("You are already registered. Please login.")
            } else if (error.response.data === "User type not matching"){
                alert("You are not registered as a student. Please register as a student.")
                navigate('/')
            } else if (error.response.data === "User not verified") {
                alert("Please verify your email first.")
                setPage(2)
            } else if (error.response.data === "User not found") {
                alert("Please register first.")
                setPage(1)
            } else if (error.response.status < 500) {
                alert(error.response.data);
                setPage(4)
            } else {
                alert("Something went wrong. Please try again later. If the problem persists, please contact admin.")
                setPage(4)
            }
        })
    }
    const handleVerifyEmail = (e) => {
        e.preventDefault()
        const entry_number = cookies.get('entry_number', { path: '/' });
        const host = "http://10.17.50.150/backend";
        axios.post(`${host}/api/resend-otp/`, {
            "entry_number": entry_number,
        }).then(function () {
            setPage(2)
        }).catch(function (error) {
            if (error.response.data === "User already verified") {
                setPage(3)
            }
        })
    }
    const handleRestart = (e) => {
        e.preventDefault()
        cookies.remove('entry_number', { path: '/' })
        setPage(1)
    }
    return (
        <div className={loading ? "text-center signup-container signup-container-loading" : "text-center signup-container"}>
            {loading && <CircularProgress style={{width: '100px', height: '100px'}} className='progress-circle' />}
            {page === 1 &&
                <div className="row">
                    <div className="col-4 bg-second" style={{ paddingTop: "250px" }}>
                        <h3 className='m-5'>Already Signed Up?</h3>
                        <Link to="/" onChange={handleChange} type="button" className="btn btn-light btn-lg">Login</Link>
                    </div>

                    <div className="col-8" style={{ paddingTop: "100px" }}>
                        <div className="container-screen">
                            <h3>Create an Account as Student</h3>
                            <form onSubmit={handleClick1} className="form-wrapper d-flex flex-column justify-content-center align-items-center">
                                <div className='full-input w-50 m-2'>
                                    <label htmlFor="email" >Name*</label>
                                    <input onChange={handleChange} type="text" name="name" />
                                </div>
                                <div className='full-input w-50 m-2'>
                                    <label htmlFor="entry_number" >IITD Entry Number*</label>
                                    <input onChange={handleChange} type="text" name="entry_number" placeholder="Eg: 2021CS10001" />
                                </div>
                                <div className='full-input w-50 m-2'>
                                    <label htmlFor="password">Password* (At least 6 characters)</label>
                                    <input onChange={handleChange} type="password" name="password" />
                                </div>
                                <PasswordStrengthBar password={sign.password} minLength={6} style={{width: '50%'}} />
                                <div className='full-input w-50 m-2'>
                                    <label htmlFor="cpassword" >Confirm Password*</label>
                                    <input onChange={handleChange} type="password" name="cpassword" />
                                </div>
                                <button type='submit' disabled={sign.name.length < 1 || sign.password !== sign.cpassword || sign.password.length < 6 || !validEntryNumber.test(sign.entry_number)} className="btn btn-dark btn-lg w-50 mt-5" >Next</button>
                            </form>
                        </div>
                    </div>
                </div>}
            {page === 2 &&
                <div className="row" >
                    <div className="col-4 bg-second" style={{ paddingTop: "250px" }}>
                        <h3 className='m-5'>Already Signed Up?</h3>
                        <Link to="/" onChange={handleChange} type="button" className="btn btn-light btn-lg">Login</Link>
                    </div>
                    <div className="col-8">
                        <div className="container-screen my-5" style={{ paddingTop: "100px" }}>
                            <h3 className='my-4'>We Sent you a Code</h3>
                            <p>Enter the OTP sent to you on {sign.entry_number.slice(4, 7).toLowerCase() + sign.entry_number.slice(2, 4) + sign.entry_number.slice(7, 11) + "@iitd.ac.in"}</p>
                            <form onSubmit={handleClick2} className="form-wrapper d-flex flex-column justify-content-center align-items-center">
                                {/* <Otpbox /> */}
                                <OTPInput value={OTP} onChange={setOTP} autoFocus OTPLength={6} otpType="number" disabled={false} inputStyles={{border: "1px solid black"}} />
                                <button type='submit' disabled={OTP.length < 6} className='btn btn-lg btn-dark my-3' >Verify Account</button>
                                <p>Didn't Recieve Email?</p>
                                <button className='btn btn-sm btn-dark my-3' onClick={handleVerifyEmail}>Resend Email</button>
                                <button className='btn btn-sm btn-dark my-3' onClick={handleRestart}>Restart Registration</button>
                            </form>
                        </div>
                    </div>
                </div>}
            {page === 3 &&
                <div className="row">
                    <div className="col-4 bg-second" style={{ paddingTop: "250px" }}>
                        <h3 className='m-5'>Already Signed Up?</h3>
                        <Link to="/" onChange={handleChange} type="button" className="btn btn-light btn-lg">Login</Link>
                    </div>
                    <div className="col-8">
                        <form onSubmit={handleClick3} className="container-screen mt-5" style={{ paddingTop: "100px" }}>
                            <h3>Additional Details</h3>
                            <div className="form-wrapper d-flex flex-column justify-content-center align-items-center" >
                                <div className='full-input w-50 m-2'>
                                    <label htmlFor="cgpa" >Most Recent CGPA*</label>
                                    <input onChange={handleChange} type="text" name="cgpa" />
                                </div>
                                <small>(Note that this would be officially verified. Any discrepency may attract penalty)</small>
                            </div>
                            <label className="my-3" style={{ fontSize: '15px' }}>Program*</label>
                            <div className="form-wrapper d-flex flex-row justify-content-center align-items-center" >
                                <div className="form-check" style={{ fontSize: '10px' }} onChange={handleChange}>
                                    <input name="program" type="radio" value="BTECH" />
                                    <label className="form-check-label py-2" htmlFor="checkbox">B.Tech</label>
                                </div>
                                <div className="form-check" style={{ fontSize: '20px' }} onChange={handleChange}>
                                    <input name="program" type="radio" value="MTECH" />
                                    <label className="form-check-label py-2" htmlFor="checkbox">M.Tech</label>
                                </div>
                                <div className="form-check" style={{ fontSize: '20px' }} onChange={handleChange}>
                                    <input name="program" type="radio" value="MSC" />
                                    <label className="form-check-label py-2" htmlFor="checkbox">M.Sc</label>
                                </div>
                                <div className="form-check" style={{ fontSize: '20px' }} onChange={handleChange}>
                                    <input name="program" type="radio" value="MSR" />
                                    <label className="form-check-label py-2" htmlFor="checkbox">M.S.R</label>
                                </div>
                                <div className="form-check" style={{ fontSize: '20px' }} onChange={handleChange}>
                                    <input name="program" type="radio" value="MDES" />
                                    <label className="form-check-label py-2" htmlFor="checkbox">M.Des</label>
                                </div>
                                <div className="form-check" style={{ fontSize: '20px' }} onChange={handleChange}>
                                    <input name="program" type="radio" value="MBA" />
                                    <label className="form-check-label py-2" htmlFor="checkbox">MBA</label>
                                </div>
                                <div className="form-check" style={{ fontSize: '20px' }} onChange={handleChange}>
                                    <input name="program" type="radio" value="MPP" />
                                    <label className="form-check-label py-2" htmlFor="checkbox">M.P.P.</label>
                                </div>
                                <div className="form-check" style={{ fontSize: '20px' }} onChange={handleChange}>
                                    <input name="program" type="radio" value="PGD" />
                                    <label className="form-check-label py-2" htmlFor="checkbox">P.G.Dip</label>
                                </div>
                                <div className="form-check" style={{ fontSize: '20px' }} onChange={handleChange}>
                                    <input name="program" type="radio" value="PHD" />
                                    <label className="form-check-label py-2" htmlFor="checkbox">Ph.D</label>
                                </div>
                            </div>
                            <div className="form-wrapper d-flex flex-column justify-content-center align-items-center" >
                                <div className='d-flex'>
                                    <button className='btn btn-lg btn-dark my-4 mx-2' onClick={() => { setPage(page - 1) }}>Back</button>
                                    <button type='submit' disabled={sign.cgpa.length<1 || sign.program.length<1} className='btn btn-lg btn-dark my-4 mx-2' >Next</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>}
            {page === 4 &&
                <div className="row">
                    <div className="col-4 bg-second" style={{ paddingTop: "250px" }}>
                        <h3 className='m-5'>Already Signed Up?</h3>
                        <Link to="/" onChange={handleChange} type="button" className="btn btn-light btn-lg">Login</Link>
                    </div>
                    <div className="col-8">
                        <div className="container-screen mt-5" style={{ paddingTop: "100px" }}>
                            <h3>Additional Details</h3>
                            <form onSubmit={handleClick4} className="form-wrapper d-flex flex-column justify-content-center align-items-center" >
                                <div className='full-input m-2'>
                                    <label htmlFor="resume" placeholder="resume">Upload Resume*</label>
                                    <input type="file" name="resume" onChange={handleFileChange} />
                                </div>
                                <div className='full-input m-2'>
                                    <label htmlFor="academic_transcript" placeholder="academic_transcript">Upload Latest Academic Transcript*</label>
                                    <input type="file" name="academic_transcript" onChange={handleFileChange} />
                                </div>
                                <div className='d-flex'>
                                    <button className='btn btn-lg btn-dark my-4 mx-2' onClick={() => { setPage(page - 1) }}>Back</button>
                                    <button type='submit' disabled={sign.academic_transcript===null || sign.resume===null} className='btn btn-lg btn-dark my-4 mx-2' >Finish</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>}
        </div >
    )
}




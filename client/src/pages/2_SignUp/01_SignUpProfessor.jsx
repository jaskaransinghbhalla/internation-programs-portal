// Packages
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
import OTPInput from "otp-input-react";
import { CircularProgress } from "@mui/material";
import PasswordStrengthBar from "react-password-strength-bar";

// Components
// import Otpbox from './03_Otp-box.jsx'
// import Context from "../../contexts/Context";
import "./SignUp.css";

export default function Home() {
  const cookies = new Cookies();
  const navigate = useNavigate();
  // const context = useContext(Context);
  // const { finalOTP } = context;
  const [loading, setLoading] = useState(false);
  const [OTP, setOTP] = useState("");
  const [sign, setSign] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
    university: "",
    department: "",
    designation: "",
    contact_email: "",
    website: "",
  });
  const state = cookies.get("email") ? 2 : 1;
  const [page, setPage] = useState(state);
  const handleChange = (e) => {
    setSign({ ...sign, [e.target.name]: e.target.value });
  };
  const handleClick1 = (e) => {
    if (sign.password !== sign.cpassword) {
      e.preventDefault();
      alert("Passwords do not match");
      return;
    } else {
      e.preventDefault();
      const { name, password, email } = sign;
      const host = "http://10.17.50.150/backend";
      setLoading(true);
      axios
        .post(`${host}/api/register/professor/basic/`, {
          name: name,
          email: email,
          password: password,
        })
        .then(function () {
          setLoading(false);
          if (!cookies.get("email")) {
            cookies.set("email", email, { path: "/" });
          }
          setPage(2);
        })
        .catch(function (error) {
          setLoading(false);
          if (error.response.data === "User already registered") {
            navigate("/");
            alert("You are already registered. Please login.");
          } else if (error.response.data === "User already verified") {
            cookies.set("email", email, { path: "/" });
            setPage(3);
          } else if (error.response.status < 500) {
            alert(error.response.data);
            setPage(1);
          } else {
            alert(
              "Something went wrong. Please try again later. If the problem persists, please contact admin."
            );
            setPage(1);
          }
        });
    }
  };
  const handleClick2 = (e) => {
    e.preventDefault();
    // const { email } = sign;
    const email = cookies.get("email", { path: "/" });
    const host = "http://10.17.50.150/backend";
    setLoading(true);
    axios
      .post(`${host}/api/verify-otp/`, {
        email: email,
        otp: OTP,
      })
      .then(function () {
        setLoading(false);
        if (cookies.get("email")) {
          cookies.remove("email", { path: "/" });
        }
        setPage(3);
      })
      .catch(function (error) {
        setLoading(false);
        if (error.response.data === "User already registered") {
          navigate("/");
          alert("You are already registered. Please login.");
        } else if (error.response.data === "User already verified") {
          setPage(3);
        } else if (error.response.data === "OTP Expired") {
          alert("OTP has expired. Click on resend OTP button to get a new OTP");
        } else if (error.response.status < 500) {
          alert(error.response.data);
          setPage(2);
        } else {
          alert(
            "Something went wrong. Please try again later. If the problem persists, please contact admin."
          );
          setPage(2);
        }
      });
  };
  const handleClick3 = (e) => {
    e.preventDefault();
    const {
      email,
      university,
      department,
      website,
      contact_email,
      designation,
    } = sign;
    const host = "http://10.17.50.150/backend";
    setLoading(true);
    axios
      .post(`${host}/api/register/professor/additional/`, {
        email: email,
        department: department,
        university: university,
        designation: designation,
        contact_email: contact_email,
        website: website,
      })
      .then(function () {
        setLoading(false);
        cookies.remove("email", { path: "/" });
        navigate("/");
      })
      .catch(function (error) {
        setLoading(false);
        if (error.response.data === "Profile already exists") {
          navigate("/");
          alert("You are already registered. Please login.");
        } else if (error.response.data === "User type not matching") {
          alert(
            "You are not registered as a professor. Please register as a professor."
          );
          navigate("/");
        } else if (error.response.data === "User not verified") {
          alert("Please verify your email first.");
          setPage(2);
        } else if (error.response.data === "User not found") {
          alert("Please register first.");
          setPage(1);
        } else if (error.response.status < 500) {
          alert(error.response.data);
          setPage(3);
        } else {
          alert(
            "Something went wrong. Please try again later. If the problem persists, please contact admin."
          );
          setPage(3);
        }
      });
  };
  const handleVerifyEmail = (e) => {
    e.preventDefault();
    const email_resend = cookies.get("email", { path: "/" });
    const host = "http://10.17.50.150/backend";
    axios
      .post(`${host}/api/resend-otp/`, {
        email: email_resend,
      })
      .then(function () {
        setPage(2);
      })
      .catch(function (error) {
        if (error.response.data === "User already verified") {
          setPage(3);
        }
      });
  };
  const handleRestart = (e) => {
    e.preventDefault();
    cookies.remove("email", { path: "/" });
    setPage(1);
  };
  return (
    <div
      className={
        loading
          ? "text-center signup-container signup-container-loading"
          : "text-center signup-container"
      }
    >
      {loading && (
        <CircularProgress
          style={{ width: "100px", height: "100px" }}
          className="progress-circle"
        />
      )}
      {page === 1 && (
        <div className="row">
          <div className="col-4 bg-second" style={{ paddingTop: "250px" }}>
            <h3 className="m-5">Already Signed Up?</h3>
            <Link
              to="/"
              onChange={handleChange}
              type="button"
              className="btn btn-light btn-lg"
            >
              Login
            </Link>
          </div>

          <div className="col-8" style={{ paddingTop: "100px" }}>
            <div className="container-screen">
              <h3>Create an Account as Professor</h3>
              <form
                onSubmit={handleClick1}
                className="form-wrapper d-flex flex-column justify-content-center align-items-center"
              >
                <div className="full-input w-50 m-2">
                  <label htmlFor="email">Name*</label>
                  <input onChange={handleChange} type="text" name="name" />
                </div>
                <div className="full-input w-50 m-2">
                  <label htmlFor="email">Official Institute Email*</label>
                  <input onChange={handleChange} type="text" name="email" />
                </div>
                <div className="full-input w-50 m-2">
                  <label htmlFor="password">
                    Password* (At least 6 Characters)
                  </label>
                  <input
                    onChange={handleChange}
                    type="password"
                    name="password"
                  />
                </div>
                <PasswordStrengthBar
                  password={sign.password}
                  minLength={6}
                  style={{ width: "50%" }}
                />
                <div className="full-input w-50 m-2">
                  <label htmlFor="cpassword">Confirm Password*</label>
                  <input
                    onChange={handleChange}
                    type="password"
                    name="cpassword"
                  />
                </div>
                <button
                  type="submit"
                  disabled={
                    sign.name.length < 1 ||
                    sign.password.length < 6 ||
                    sign.email.length < 1 ||
                    sign.password !== sign.cpassword
                  }
                  className="btn btn-dark btn-lg w-50 mt-5"
                >
                  Next
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      {page === 2 && (
        <div className="row">
          <div className="col-4 bg-second" style={{ paddingTop: "250px" }}>
            <h3 className="m-5">Already Signed Up?</h3>
            <Link
              to="/"
              onChange={handleChange}
              type="button"
              className="btn btn-light btn-lg"
            >
              Login
            </Link>
          </div>
          <div className="col-8">
            <form
              onSubmit={handleClick2}
              className="container-screen my-5"
              style={{ paddingTop: "100px" }}
            >
              <h3 className="my-4">We Sent you a Code</h3>
              <p>Enter the OTP sent to you on {cookies.get("email")}</p>
              <div className="form-wrapper d-flex flex-column justify-content-center align-items-center">
                {/* <Otpbox /> */}
                <OTPInput
                  value={OTP}
                  onChange={setOTP}
                  autoFocus
                  OTPLength={6}
                  otpType="number"
                  disabled={false}
                  inputStyles={{ border: "1px solid black" }}
                />
                <button
                  type="submit"
                  disabled={OTP.length < 6}
                  className="btn btn-lg btn-dark my-3"
                >
                  Verify Account
                </button>
                <p>Didn't Recieve Email?</p>
                <button
                  className="btn btn-lg btn-dark my-3"
                  onClick={handleVerifyEmail}
                >
                  Resend Email
                </button>
                <button
                  className="btn btn-sm btn-dark my-3"
                  onClick={handleRestart}
                >
                  Restart Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {page === 3 && (
        <div className="row">
          <div className="col-4 bg-second" style={{ paddingTop: "250px" }}>
            <h3 className="m-5">Already Signed Up?</h3>
            <Link
              to="/"
              onChange={handleChange}
              type="button"
              className="btn btn-light btn-lg"
            >
              Login
            </Link>
          </div>
          <div className="col-8">
            <div
              className="container-screen mt-5"
              style={{ paddingTop: "100px" }}
            >
              <h3>Additional Details</h3>
              <form
                onSubmit={handleClick3}
                className="form-wrapper d-flex flex-column justify-content-center align-items-center"
              >
                <div className="full-input w-50 m-2">
                  <label htmlFor="university">Institute*</label>
                  <input
                    onChange={handleChange}
                    type="text"
                    name="university"
                    value={sign.university}
                    placeholder="Eg: XYZ Institute of Technology"
                  />
                </div>
                <div className="full-input w-50 m-2">
                  <label htmlFor="department">Department*</label>
                  <input
                    onChange={handleChange}
                    type="text"
                    name="department"
                    value={sign.department}
                    placeholder="Eg: Computer Science and Engineering"
                  />
                </div>
                <div className="full-input w-50 m-2">
                  <label htmlFor="designation">Designation*</label>
                  <input
                    onChange={handleChange}
                    type="text"
                    name="designation"
                    value={sign.designation}
                    placeholder="Eg: Assistant Professor"
                  />
                </div>
                <div className="full-input w-50 m-2">
                  <label htmlFor="contact_email">
                    Alternate Email (Optional)
                  </label>
                  <input
                    onChange={handleChange}
                    type="text"
                    name="contact_email"
                    value={sign.contact_email}
                  />
                </div>
                <div className="full-input w-50 m-2">
                  <label htmlFor="website">Website (Optional)</label>
                  <input
                    onChange={handleChange}
                    type="text"
                    name="website"
                    value={sign.website}
                    placeholder="Eg: https://prof.xyz.edu"
                  />
                </div>
                <div className="d-flex">
                  <button
                    type="submit"
                    disabled={
                      sign.department.length < 1 ||
                      sign.designation.length < 1 ||
                      sign.university.length < 1
                    }
                    className="btn btn-lg btn-dark my-4 mx-2"
                  >
                    Finish
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Packages
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";

// Components
import logo from "./../../assets/logo.png";
import avatar from "../../assets/img_avatar.png";

export default function Navbar() {
  let cookies = new Cookies();
  const navigate = useNavigate();
  const logout = (e) => {
    e.preventDefault();
    const host = "http://10.17.50.150/backend";
    const token = cookies.get("refresh")
    cookies.remove("access", { path: "/" });
    cookies.remove("refresh", { path: "/" });
    axios
      .post(`${host}/api/logout/`, {
        refresh: token,
      })
      .then(function () {
        navigate("/");
      })
      .catch(function () {
        alert("Something went wrong. Please try again later. If the problem persists, please contact admin.");
        navigate("/");
      });
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <img
        className="mx-3"
        style={{ height: "50px", width: "50px", borderRadius: "50%" }}
        src={logo}
        alt="Logo"
      />
      <p className="navbar-brand my-2">International Programme</p>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div
        className="collapse navbar-collapse justify-content-center mx-4"
        id="navbarSupportedContent"
      >
        <ul className="navbar-nav mr-auto">
          <li className="nav-item active">
            <Link
              to="/dashboard/student"
              className="navbar-brand mx-2"
              style={{ paddingRight: "150px" }}
            >
              Dashboard
            </Link>
          </li>
        </ul>
      </div>
      <form className="form-inline mx-2">
        <Link to='/student/profile'>
          <img
            className="mx-3"
            style={{ height: "50px", width: "50px", borderRadius: "50%" }}
            src={avatar}
            alt="Profile"
          />
        </Link>
        <button
          className="btn btn-outline-light my-2 mx-2 my-sm-0"
          type="submit"
          onClick={logout}
        >
          Logout
        </button>
      </form>
    </nav>
  );
}

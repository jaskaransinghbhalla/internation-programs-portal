// Packages
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
import { CircularProgress } from "@mui/material";

// Components
import Navbar from "./00_Navbar";
import LeftSection from "./02_LeftSection";
import RightSection from "./03_RightSection";
import SimpleAccordion from "./04_SimpleAccordion";

export default function ProfHome() {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  // Getting Internships
  const getInterns = () => {
    const host = "http://10.17.50.150/backend";
    const config = {
      headers: { Authorization: `Bearer ${cookies.get("access")}` },
    };
    setLoading(true);
    axios
      .get(`${host}/api/internship/all/student/`, config)
      .then(function (response) {
        setLoading(false);
        setData(response.data);
      })
      .catch(function (error) {
        setLoading(false);
        if (error.response.status === 401) {
          alert("Session Expired. Please login again.");
          navigate("/");
        }else if (error.response.status < 500) {
          alert(error.response.data);
        }else{
          alert("Something went wrong. Please try again later. If the problem persists, please contact admin.")
        }
      });
  };
  const interns = data.map((internship) => {
    return (
      <SimpleAccordion
        key={internship.id}
        id={internship.id}
        title={internship.title}
        text={internship.description}
        professor={internship.professor}
      />
    );
  });
  useEffect(() => {
    getInterns();
    // eslint-disable-next-line
  }, []);
  return (
    <div>
      <Navbar />
      <div className="row ">
        <LeftSection />
        <div className={loading ? "loading col-8 container-screen bg-light" : "col-8 container-screen bg-light"}>
          <h4 className="mx-5 mt-5 mb-3">All Eligible Internships</h4>
          {loading && <CircularProgress style={{width: '100px', height: '100px'}} className='progress-circle' />}
          {interns}
        </div>
        <RightSection />
      </div>
    </div>
  );
}

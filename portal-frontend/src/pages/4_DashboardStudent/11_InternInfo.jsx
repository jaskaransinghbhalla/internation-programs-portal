// Packages
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
import { CircularProgress } from "@mui/material";

// Components
import "./file.css";
import Navbar from "./00_Navbar";
import LeftSection from "./02_LeftSection";
import SimpleAccordion2 from "./10_SimpleAccordion2";
const host = "http://10.17.50.150/backend";
export default function InternInfo() {
  //   const refresh = () => window.location.reload(true);
  // let { id } = useParams();
  const navigate = useNavigate();
  const cookies = new Cookies();
  const [applied, setApplied] = useState([]);
  const [shortlist, setShortlist] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const getApplied = () => {
    const config = {
      headers: { Authorization: `Bearer ${cookies.get("access")}` },
    };
    setLoading(true);
    axios
      .get(`${host}/api/internship/all/applied`, config)
      .then(function (response) {
        setLoading(false);
        setApplied(response.data);
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
  const getShortlisted = () => {
    const config = {
      headers: { Authorization: `Bearer ${cookies.get("access")}` },
    };
    setLoading(true);
    axios
      .get(`${host}/api/internship/all/shortlisted`, config)
      .then(function (response) {
        setLoading(false);
        setShortlist(response.data);
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
  useEffect(() => {
    getApplied();
    getShortlisted();
    // eslint-disable-next-line
  }, []);

  const handleApplied = () => {
    setPage(1);
  };
  const handleShortlisted = () => {
    setPage(2);
  };
  function Applied() {
    return (
      <div className="row">
        <div className="col">
          <div className="row">
            <h5 className="mx-5 col-8">Applied</h5>
            <div className="col-10">
              {applied.map((internship) => {
                return (
                  <div key={internship.id} className="row">
                    <div className="col-8">
                      <SimpleAccordion2 internship={internship} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
  function Shorlisted() {
    return (
      <div className="row">
        <div className="col">
          <div className="row">
            <h5 className="mx-5 col-8">Shortlisted</h5>
            <div className="col-10">
              {shortlist.map((internship) => {
                return (
                  <div key={internship.id} className="row">
                    <div className="col-8">
                      <SimpleAccordion2 internship={internship} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div>
      <Navbar />
      <div className="row">
        <LeftSection />
        <div className={loading ? "loading col-10 container-screen bg-light" : "col-10 container-screen bg-light"}>
          {loading && <CircularProgress style={{width: '100px', height: '100px'}} className='progress-circle' />}
          <div className="row">
            <div className="col-8">
              <h3 className="mt-5 mx-5">Applications</h3>
            </div>
            <div className="col-2 mt-5 mx-5">
              <div className="btn-group" role="group" aria-label="Basic example" >
                <button type="button" className="btn btn-custom-1" onClick={handleApplied} >Applied</button>
                <button type="button" className="btn btn-custom-1" onClick={handleShortlisted} >Shortlisted</button>
              </div>
            </div>
          </div>
          <div>
            {page === 1 ? <Applied /> : null}
            {page === 2 ? <Shorlisted /> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

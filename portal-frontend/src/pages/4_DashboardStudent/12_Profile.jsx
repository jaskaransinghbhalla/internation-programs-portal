import Cookies from "universal-cookie";
import axios from "axios";
import React, { useState, useEffect } from "react";

// Components
import LeftSection from "./02_LeftSection";
import Navbar from "./00_Navbar";
import RightSection from "./03_RightSection";

const ProfessorProfile = () => {
  const host = "http://10.17.50.150/backend";
  const cookies = new Cookies();
  const [data, setData] = useState([]);
  // Getting Internships
  const getProfile = () => {
    const config = {
      headers: { Authorization: `Bearer ${cookies.get("access")}` },
    };
    axios
      .get(`${host}/api/user`, config)
      .then(function (response) {
        setData(response.data);
        console.log(response.data);
      })
      .catch(function () {});
  };

  useEffect(() => {
    getProfile();
    // eslint-disable-next-line
  }, []);
  return (
    <div>
      <Navbar />
      <div className="row ">
        <LeftSection />

        <div className="col-8 container-screen bg-light">
          <div className="mx-5 my-3">
            <div className="container mt-4 mb-4 p-3 d-flex justify-content-center">
              <div className="card p-5">
                <div className=" d-flex flex-column justify-content-center align-items-center">
                  <button className="btn btn-secondary">
                    <img
                      src="https://i.imgur.com/wvxPV9S.png"
                      height="200"
                      width="200"
                      alt="Profile"
                    />
                  </button>
                  <span className="mt-2 mb-1 h4">{data.name}</span>

                  <div>
                    Entry Number :
                    <span className="my-1 ">{data.entry_number}</span>
                  </div>
                  <div>
                    Department :<span className="my-1 ">{data.department}</span>
                  </div>
                  <div>
                    CGPA :<span className="my-1 ">{data.cgpa}</span>
                  </div>
                  <div>
                    Program :<span className="my-1 ">{data.program}</span>
                  </div>
                  <div>
                    Email : <span className="my-1 ">{data.email}</span>
                  </div>
                  <span>
                    <a
                      className="mx-1 my-2 btn btn-sm btn-dark"
                      href={`${host}${data.resume}`}
                    >
                      Resume
                    </a>{" "}
                  </span>
                  <span>
                    <a
                      className="mx-1 my-2 btn btn-sm btn-dark"
                      href={`${host}${data.academic_transcript}`}
                    >
                      Academic Transcript
                    </a>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div />
        </div>

        <RightSection />
      </div>
    </div>
  );
};

export default ProfessorProfile;

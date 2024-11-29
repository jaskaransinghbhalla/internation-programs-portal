// Packages
import { useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import dayjs from 'dayjs';
import { CircularProgress } from "@mui/material";

// Packages
import "./file.css";
import Navbar from "./00_Navbar";
import LeftSection from "./02_LeftSection";

export default function InternProf() {
  const navigate = useNavigate();
  const host = "http://10.17.50.150/backend";
  const cookies = new Cookies();
  const refresh = () => window.location.reload(true);
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ professor: {} });
  const [isApplying, setisApplying] = useState(false);
  const [sop, setSop] = useState(null);
  const [filename, setfilename] = useState("No File Chosen");
  const [apidata, setapi] = useState({ sop: null,  });
  const config = {
    headers: { Authorization: `Bearer ${cookies.get("access")}` },
  };

  const getIntern = () => {
    setLoading(true);
    axios
      .get(`${host}/api/internship/${id}`, config)
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

  const formData = new FormData();
  formData.append("internship_id", id);
  const handleChange = (e) => {
    setapi({ ...apidata, [e.target.name]: e.target.value });
  };
  const handleFileChange = (e) => {
    handleChange(e);
    setapi({ ...apidata, [e.target.name]: e.target.files[0] });
    setfilename(e.target.files[0].name);
    setSop(e.target.files[0])
  };

  const applyIntern = () => {
    const host = "http://10.17.50.150/backend";
    formData.append("statement_of_purpose", sop);
    setLoading(true);
    axios
      .post(`${host}/api/internship/apply/`, formData, {
        headers: {
          "Content-type": "multipart/form-data",
          "Authorization": `Bearer ${cookies.get("access")}`
        },
      })
      .then(function () {
        setLoading(false);
        alert("Applied Successfully");
        refresh();
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
  const UnapplyIntern = () => {
    setLoading(true);
    axios
      .post(
        `${host}/api/internship/unapply/`,
        {internship_id: id},
        config
      )
      .then(function () {
        setLoading(false);
        alert("Unapplied Successfully");
        refresh();
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
    getIntern();
    // eslint-disable-next-line
  }, []);

  function Summary() {
    return (
      <div>
        <h4 className='mx-5 my-4 col-8'>About the Project</h4>
        <div className='px-5 my-2 row'>
            <h6 className='col-3'>Field</h6>
            <div className='col-9'>{data.field}</div>
        </div>
        <div className='px-5 my-2 row'>
            <h6 className='col-3'>Description</h6>
            <div className='col-9'>{data.description}</div>
        </div>
        <div className='px-5 my-2 row'>
            <h6 className='col-3'>Mode</h6>
            <div className='col-9'>{data.type}</div>
        </div>
        <div className='px-5 my-2 row'>
            <h6 className='col-3'>Duration</h6>
            <div className='col-9'>{dayjs(data.start_date).format("D MMMM YYYY")} - {dayjs(data.end_date).format("D MMMM YYYY")}</div>
        </div>
        <div className='px-5 my-2 row'>
            <h6 className='col-3'>Number of Offers</h6>
            <div className='col-9'>{data.no_of_offers}</div>
        </div>
        <div className='px-5 my-2 row'>
            <h6 className='col-3'>Stipend</h6>
            <div className='col-9'>INR {data.stipend}</div>
        </div>
        <h4 className='mx-5 my-4 col-8'>About the Professor</h4>
        <div className='px-5 my-2 row'>
            <h6 className='col-3'>Name</h6>
            <div className='col-9'>Prof. {data.professor.name}</div>
        </div>
        <div className='px-5 my-2 row'>
            <h6 className='col-3'>Designation</h6>
            <div className='col-9'>{data.professor.designation}</div>
        </div>
        <div className='px-5 my-2 row'>
            <h6 className='col-3'>Department</h6>
            <div className='col-9'>{data.professor.department}</div>
        </div>
        <div className='px-5 my-2 row'>
            <h6 className='col-3'>University</h6>
            <div className='col-9'>{data.professor.university}</div>
        </div>
        <div className='px-5 my-2 row'>
            <h6 className='col-3'>Contact Email</h6>
            <div className='col-9'>
              <div><a href={`mailto:${data.professor.email}`}>{data.professor.email}</a></div>
              {data.professor.contact_email && <div><a href={`mailto:${data.professor.contact_email}`}>{data.professor.contact_email}</a></div>}
            </div>
        </div>
        {data.professor.website && 
        <div className='px-5 my-2 row'>
            <h6 className='col-3'>Website</h6>
            <div className='col-9'><a href={data.professor.website}>{data.professor.website}</a></div>
        </div>
        }
        <h4 className='mx-5 my-4 col-8'>Eligibility and Application Details</h4>
        <div className='px-5 my-2 row'>
            <h6 className='col-3 ml-5'>Expected Skills</h6>
            <div className='col-9'>{data.expected_skills}</div>
        </div>
        <div className='px-5 my-2 row'>
            <h6 className='col-3'>Application Deadline</h6>
            <div className='col-9'>{dayjs(data.application_deadline).format("D MMMM YYYY")}</div>
        </div>
        {data.has_applied ? (
          <>
            <div className='px-5 my-2 row'>
                <h6 className='col-3'>Your Statement of Purpose</h6>
                <div className='col-9'><a href={`http://10.17.50.150/backend${data.application.statement_of_purpose}`}>View</a></div>
            </div>
            {!dayjs().isAfter(dayjs(data.application_deadline)) && <div className='px-5 my-2 small'>If you want to edit your SOP, withdraw the application and apply again with the new SOP before the deadline.</div>}
            <div>
              <button className="btn btn-dark mx-5 mb-5 mt-3" onClick={() => {
                if (dayjs().isAfter(dayjs(data.application_deadline))){
                  if (window.confirm("The application deadline has passed, you can't apply again if you withdraw now. Are you sure you want to proceed?")) {
                    UnapplyIntern()
                  }
                } else {
                  if (window.confirm("Are you sure you want to withdraw your application? You can apply again later if you wish.")) {
                    UnapplyIntern()
                  }
                }
              }}>Withdraw Application</button>
            </div>
          </>
        ) : (
          isApplying ? (
            <div className="mt-4 mb-5">
              <div>
                <label className="mx-5 my-2" type="text">Statement of Purpose</label>
                <input className="mx-5 my-2 sopform" type="file" name="sop" style={{ display: "Ïnone" }} onChange={handleFileChange} />
                <div className="mx-5 my-1>">{filename}</div>
                <br />
                <button className="btn btn-dark mx-5" onClick={() => {
                  if (window.confirm("Are you sure you want to Apply?")) {
                    applyIntern();
                  }
                }}>Apply</button>
              </div>
            </div>
          ) : (
            <div className="container">
              <button className="btn btn-dark mx-4 mb-5 mt-3" onClick={() => { setisApplying(!isApplying) }}>Start Application</button>
            </div>
          )
        )}
      </div>
    );
  }
  return (
    <div>
      <Navbar />
      <div className="row">
        <LeftSection />
        <div className={loading? "loading col-10 container-screen bg-light" : "col-10 container-screen bg-light"}>
          {loading && <CircularProgress style={{width: '100px', height: '100px'}} className='progress-circle' />}
          <div className="row">
            <div className="col-8">
              <h3 className="mt-5 mx-5">{data.title}</h3>
            </div>
          </div>
          <Summary />
        </div>
      </div>
    </div>
  );
}

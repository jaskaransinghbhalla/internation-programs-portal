// Packages
import Cookies from 'universal-cookie'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CircularProgress } from "@mui/material";

// Components
import LeftSection from './02_LeftSection'
import Navbar from './00_Navbar'
import RightSection from './03_RightSection'
import SimpleAccordion from './04_SimpleAccordion'

export default function ProfHome() {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  // Getting Internships
  const getInterns = () => {
    const host = "http://10.17.50.150/backend";
    const config = {
      headers: { Authorization: `Bearer ${cookies.get('access')}` }
    };
    setLoading(true);
    axios.get(`${host}/api/internship/all/professor/`, config
    ).then(function (response) {
      setLoading(false);
      setData(response.data);
    }).catch(function (error) {
      setLoading(false);
      if (error.response.status === 401) {
        alert("Session Expired. Please login again.");
        navigate("/");
      }else if (error.response.status < 500) {
        alert(error.response.data);
      }else{
        alert("Something went wrong. Please try again later. If the problem persists, please contact admin.")
      }
    })
  }
  const interns = data.map((internship) => {
    return (<SimpleAccordion key={internship.id} internship={internship} />)
  })
  useEffect(() => {
    getInterns();
    // eslint-disable-next-line
  }, [])
  return (
    <div>
      <Navbar />
      <div className="row ">
        <LeftSection />
        <div className={loading ? "loading col-8 container-screen bg-light": "col-8 container-screen bg-light"} >
          <Link to="/dashboard/professor/intern/add" className="d-flex justify-content-center align-items-center btn btn-light dashed-border my-3" style={{marginLeft: '5%', marginRight: '5%', width: '90%', height: '82px' }} type="button"><div className='h5'>+Add New Internship</div></Link>
          {loading && <CircularProgress style={{width: '100px', height: '100px'}} className='progress-circle' />}
          {interns}
        </div>
        <RightSection />
      </div>
    </div>
  )
}

// Packages
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Cookies from 'universal-cookie'
import { CircularProgress } from "@mui/material";

// Components
import Notification from './09_Notification'

export default function RightSection() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  // Getting Internships
  const cookies = new Cookies();
  const getNotifications = () => {
    const host = "http://10.17.50.150/backend";
    const config = {
      headers: { Authorization: `Bearer ${cookies.get('access')}` }
    };
    setLoading(true);
    axios.get(`${host}/api/notification/all/`, config
    ).then(function (response) {
      setLoading(false);
      setData(response.data.reverse());
    }).catch(function (error) {
      setLoading(false);
      alert("Something went wrong. Please try again later. If the problem persists, please contact admin.")
    })
  }

  useEffect(() => {
    getNotifications();
    // eslint-disable-next-line
  }, [])
  return (
    <div className={loading? "loading col-2 text-align-left pt-3" : "col-2 text-align-left pt-3"} style={{ backgroundColor: "#DADADA", maxHeight: '100vh', overflowY: 'scroll' }} >
      {loading && <CircularProgress style={{width: '100px', height: '100px'}} className='progress-circle' />}
      {data.map((item) => {
        return (
          <Notification key={item.id} description={item.message} time={item.sent_at} />
        )
      })}
    </div >
  )
}

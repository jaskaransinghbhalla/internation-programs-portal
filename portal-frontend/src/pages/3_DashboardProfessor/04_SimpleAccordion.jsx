import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';
import dayjs from 'dayjs';

import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';

export default function SimpleAccordion(props) {
  const refresh = () => window.location.reload(true)
  const navigate = useNavigate();
  const cookies = new Cookies();
  const id = props.internship.id
  const handleDelete = () => {
    const host = 'http://10.17.50.150/backend';
    const config = {
      headers: { Authorization: `Bearer ${cookies.get('access')}` }
    };
    axios.delete(`${host}/api/internship/delete/${id}`, config
    ).then(function () {
      refresh()
    }).catch(function (error) {
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
  return (
    <div className='mx-5 my-4'>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <h5 className='my-2'>{props.internship.title} </h5>
          <Typography>
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            {props.internship.description}
          </Typography>
          <Typography>
            Mode: {props.internship.type}
          </Typography>
          <Typography>
            Duration: {dayjs(props.internship.start_date).format("D MMM'YY").toString()} - {dayjs(props.internship.end_date).format("D MMM'YY").toString()}
          </Typography>
          <Typography>
            Application Deadline: {dayjs(props.internship.application_deadline).format("D MMM'YY").toString()}
          </Typography>
          <Typography>
            Applications Received: {props.internship.applications.length}
          </Typography>
          <Link to={`/professor/internship/${props.internship.id}`} className="btn btn-sm btn-primary my-3 mx-2" >View</Link>
          <Link to={`/professor/internship/update/${props.internship.id}`} className="btn btn-sm btn-secondary my-3 mx-2" >Update</Link>
          <button onClick={() => { if (window.confirm('Are you sure you want to delete this internship? This action is irreversible.')) { handleDelete() }; }} className="btn btn-sm btn-danger my-3 mx-2" >Delete</button>
        </AccordionDetails>
      </Accordion>
    </div >
  );
}

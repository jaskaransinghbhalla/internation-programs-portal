// Packages
import * as React from 'react';
import { Link } from 'react-router-dom';

// Material UI
import Accordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

export default function SimpleAccordion(props) {
  return (
    <div className='mx-5 my-4'>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <div className='w-100 d-flex justify-content-between'>
            <h5 className='my-1'>{props.title} </h5>
            <span className='my-1 mx-2 text-muted'>{props.professor.university} </span>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <div className='mx-2'>
            <div style={{fontSize: '1.2rem'}}>Prof. {props.professor.name}</div>
            <div>{props.professor.department}, {props.professor.university}</div>
            <hr/>
            <div>{props.text}</div>
          </div>
          <Link to={`/student/internship/${props.id}`} className="btn btn-sm btn-primary my-3 mx-2" >View</Link>
        </AccordionDetails>
      </Accordion>
    </div >
  );
}

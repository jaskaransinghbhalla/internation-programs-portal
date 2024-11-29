// Packages
import * as React from 'react';

// MI UI
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
var host = "http://10.17.50.150/backend"
export default function SimpleAccordion2(props) {
  return (
    <div className='mx-5 my-2'>
      <Accordion style={{
        backgroundColor: '#F3F3F5',
        boxShadow: 'none',
        borderColor: '#DFE2E8',
        border: 'solid',
        borderRadius: '4px',
        width: '100%',
        height: '100%',
        padding: '0px',
        margin: '0px',
        fontSize: '1.2rem',
        fontWeight: '200',
        lineHeight: '1.5',
        letterSpacing: '0.00938em',
        textTransform: 'none',
        textAlign: 'left',
        textDecoration: 'none',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>
        <AccordionSummary
          style={{ textColor: '#50555C', }}
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>
            {props.student.name}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div>
            <div className='mx-1 row'>
              <Typography className='col-4'><b>Program</b></Typography>
              <Typography className='col-6'>{props.student.program}</Typography>
            </div>
            <div className='mx-1 row'>
              <Typography className='col-4'><b>Department</b></Typography>
              <Typography className='col-6'>{props.student.department}</Typography>
            </div>
            <div className='mx-1 row'>
              <Typography className='col-4'><b>Entry year</b></Typography>
              <Typography className='col-6'>{props.student.entry_year}</Typography>
            </div>
            <div className='mx-1 row'>
              <Typography className='col-4'><b>CGPA</b></Typography>
              <Typography className='col-6'>{props.student.cgpa}</Typography>
            </div>
            <span><a className='mx-1 mt-4 mb-2 btn btn-sm btn-dark' href={`${host}${props.student.resume}`}>Resume</a> </span>
            <span><a className='mx-1 mt-4 mb-2 btn btn-sm btn-dark' href={`${host}${props.statement_of_purpose}`}>Statement of Purpose</a></span>
          </div>
        </AccordionDetails>
      </Accordion>
    </div >
  );
}

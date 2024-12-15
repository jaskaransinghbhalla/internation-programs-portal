// Packages
import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";

// MI UI
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
export default function SimpleAccordion2(props) {
  const navigate = useNavigate();
  const refresh = () => window.location.reload(true);
  const cookies = new Cookies();
  const host = "http://10.17.50.150/backend";

  const config = {
    headers: { Authorization: `Bearer ${cookies.get("access")}` },
  };
  const UnapplyIntern = (id) => {
    axios
      .post(
        `${host}/api/internship/unapply/`,
        {
          internship_id: id,
        },
        config
      )
      .then(function () {
        alert("Unapplied Successfully");
        refresh();
      })
      .catch(function (error) {
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

  return (
    <div className="mx-5 my-2">
      <Accordion
        style={{
          backgroundColor: "#F3F3F5",
          boxShadow: "none",
          borderColor: "#DFE2E8",
          border: "solid",
          borderRadius: "4px",
          width: "100%",
          height: "100%",
          padding: "0px",
          margin: "0px",
          fontSize: "1.2rem",
          fontWeight: "200",
          lineHeight: "1.5",
          letterSpacing: "0.00938em",
          textTransform: "none",
          textAlign: "left",
          textDecoration: "none",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        <AccordionSummary
          style={{ textColor: "#50555C" }}
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>{props.internship.title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <span>
              <Link
                to={`/student/internship/${props.internship.id}`}
                className="btn btn-sm btn-dark mx-1"
              >
                Info
              </Link>
            </span>
            <span>
              <button
                className="mx-1 btn btn-sm btn-dark"
                onClick={() => { if (window.confirm('Are you sure you want to Unapply?')) { UnapplyIntern(props.internship.id) }; }}
              >
                Unapply
              </button>
            </span>
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

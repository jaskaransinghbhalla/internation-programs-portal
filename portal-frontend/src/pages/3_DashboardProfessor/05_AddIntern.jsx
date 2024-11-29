// Packages
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import axios from "axios";

// Components
import LeftSection from "./02_LeftSection";
import Navbar from "./00_Navbar";
import TextArea from "./06_TextArea";

// Material UI
import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { Tooltip } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import { styled } from "@mui/material/styles";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { CircularProgress } from "@mui/material";


export default function AddIntern() {
  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor:
        theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: theme.palette.mode === "light" ? "black" : "#308fe8",
    },
  }));
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [checkstate, setCheckState] = useState({
    AM: true,
    BB: true,
    CH: true,
    CS: true,
    CE: true,
    DD: true,
    EE: true,
    ES: true,
    MS: true,
    MT: true,
    ME: true,
    PH: true,
    TT: true,
  });
  const handleChangeCheck = (e) => {
    setCheckState({
      ...checkstate,
      [e.target.name]: e.target.checked,
    });
  };
  const cookies = new Cookies();
  const [intern, setIntern] = useState({
    title: "",
    field: "",
    description: "",
    expected_skills: "",
    application_deadline: null,
    start_date: null,
    end_date: null,
    type: "",
    no_of_offers: "",
    stipend: "",
    min_cgpa: "",
    pay: "",
  });
  const handleChange = (e) => {
    setIntern({ ...intern, [e.target.name]: e.target.value });
  };
  const [value, setValue] = useState(1);
  const handleSubmit = async (e) => {
    e.preventDefault();
    var eligible_departments = [];
    for (var i in checkstate)
      if (checkstate[i] === true) {
        eligible_departments.push(i);
      }
    const { title, field, description, expected_skills, application_deadline, start_date, end_date, no_of_offers, stipend, type, min_cgpa } =
      intern;
    const host = "http://10.17.50.150/backend";
    const config = {
      headers: { Authorization: `Bearer ${cookies.get("access")}` },
    };
    let finalData = {
      title: title,
      field: field,
      description: description,
      expected_skills: expected_skills,
      application_deadline: dayjs(application_deadline).format('YYYY-MM-DD'),
      start_date: dayjs(start_date).format('YYYY-MM-DD'),
      end_date: dayjs(end_date).format('YYYY-MM-DD'),
      type: type,
      eligible_departments: eligible_departments,
    }
    if (no_of_offers!==""){finalData.no_of_offers=+no_of_offers;}
    if (intern.pay==="PAID"){finalData.stipend=+stipend;}
    if (min_cgpa!==""){finalData.min_cgpa=+min_cgpa;}
    setLoading(true);
    axios.post(
      `${host}/api/internship/create/`,
      finalData,
      config
    ).then(function () {
      setLoading(false);
      alert("Internship Added Successfully");
      navigate("/dashboard/professor");
    }).catch(function (error) {
      setLoading(false);
      if (error.response.status === 401) {
        alert("Session Expired. Please login again.");
        navigate("/");
      }else if (error.response.status < 500) {
        alert(error.response.data)
      }else{
        alert("Something went wrong. Please try again later. If the problem persists, please contact admin.");
      }
    });
  };
  return (
    <div>
      <Navbar />
      <div className="row">
        <LeftSection />
        <div className={loading ? "loading col-10 bg-light" : "col-10 bg-light"}>
          {loading && <CircularProgress style={{width: '100px', height: '100px'}} className='progress-circle' />}
          {value === 1 && (
            <div className="w-75">
              <div className="container my-5 mx-5" style={{ width: "90%" }}>
                <BorderLinearProgress variant="determinate" value={33.33} />
              </div>
              <div className="container my-5 mx-5">
                <form className="my-2 d-flex flex-column align-content-between">
                  <TextArea
                    onChange={handleChange}
                    value={intern.title}
                    name="title"
                    label="Title of Project*"
                    widthp="90%"
                  />
                  <TextArea
                    onChange={handleChange}
                    value={intern.field}
                    name="field"
                    label="Field*"
                    widthp="90%"
                  />
                  <div className="form-group my-3">
                    <label htmlFor="titleOfProject" style={{ fontSize: '15px' }}>Project Description*</label>
                    <textarea value={intern.description} name="description" className="form-control" id="titleOfProject" onChange={handleChange} style={{ width: `90%` }} rows={5} />
                  </div>
                  <div className="form-group my-3">
                    <label htmlFor="titleOfProject" style={{ fontSize: '15px' }}>Expected Skills/Prerequisites*</label>
                    <textarea value={intern.expected_skills} name="expected_skills" className="form-control" id="titleOfProject" onChange={handleChange} style={{ width: `90%` }} rows={2} />
                  </div>
                  {/* <TextArea
                    onChange={handleChange}
                    value={intern.description}
                    name="description"
                    label="Description*"
                    widthp="90%"
                  /> */}
                  <label className="my-3" style={{ fontSize: "15px" }}>Type of Internship*</label>
                  <div>
                    <div className="form-check" style={{ fontSize: "20px" }} onChange={handleChange}>
                      <input className="form-check-input" name="type" type="radio" value="REMOTE" checked={intern.type==="REMOTE"} />
                      <small className="form-check-label" htmlFor="defaultCheck1">Remote (Online)</small>
                    </div>
                    <div className="form-check" style={{ fontSize: "20px" }} onChange={handleChange}>
                      <input className="form-check-input" name="type" type="radio" value="ONSITE" checked={intern.type==="ONSITE"} />
                      <small className="form-check-label" htmlFor="checkbox">On-site (Offline at the campus of your institute)</small>
                    </div>
                    <div className="form-check" style={{ fontSize: "20px" }} onChange={handleChange}>
                      <input className="form-check-input" name="type" type="radio" value="HYBRID" checked={intern.type==="HYBRID"} />
                      <small className="form-check-label" htmlFor="checkbox">Hybrid (A combination of the above two)</small>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
          {value === 2 && (
            <div className="w-75">
              <div className="container my-5 mx-5" style={{ width: "90%" }}>
                <BorderLinearProgress variant="determinate" value={66.66} />
              </div>
              <div className="container my-5 mx-5">
                <form className="my-2 d-flex flex-column align-content-between">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <div className="d-flex flex-wrap">
                      <MobileDatePicker
                        label="Project Start Date (Tentative)*"
                        value={intern.start_date}
                        onChange={(newValue) => {
                          setIntern({ ...intern, start_date: newValue });
                        }}
                        inputFormat="DD/MM/YYYY"
                        disablePast
                        renderInput={(params) => <TextField style={{ backgroundColor: '#FFFFFF', width: '40%', marginRight: '5%', marginBottom: '30px' }} {...params} />}
                      />
                      <Tooltip arrow title={intern.start_date===null?"Please select a start date first":null}>
                        <span style={{width: '40%', marginBottom: '30px'}}>
                        <MobileDatePicker
                          label="Project End Date (Tentative)*"
                          value={intern.end_date}
                          onChange={(newValue) => {
                            setIntern({ ...intern, end_date: newValue });
                          }}
                          inputFormat="DD/MM/YYYY"
                          disablePast
                          disabled={intern.start_date === null}
                          minDate={intern.start_date}
                          renderInput={(params) => <TextField disabled style={{ backgroundColor: '#FFFFFF', width: '100%' }} {...params} />}
                        />
                        </span>
                      </Tooltip>
                      <Tooltip arrow title={intern.start_date===null?"Please select a start date first":null}>
                        <span style={{width: '40%', marginBottom: '30px'}}>
                        <MobileDatePicker
                          label="Application Deadline*"
                          value={intern.application_deadline}
                          onChange={(newValue) => {
                            setIntern({ ...intern, application_deadline: newValue });
                          }}
                          inputFormat="DD/MM/YYYY"
                          disablePast
                          disabled={intern.start_date === null}
                          maxDate={intern.start_date}
                          renderInput={(params) => <TextField style={{ backgroundColor: '#FFFFFF', width: '100%' }} {...params} />}
                        />
                        </span>
                        </Tooltip>
                    </div>
                  </LocalizationProvider>
                  <TextArea
                    onChange={handleChange}
                    value={intern.no_of_offers}
                    name="no_of_offers"
                    label="Total Number of offers"
                    widthp="30%"
                    placeholder='1'
                  />
                  <label className="my-3" style={{ fontSize: "15px" }}>Paid or Unpaid</label>
                  <div>
                    <div className="form-check" style={{ fontSize: "20px" }} onChange={handleChange}>
                      <input className="form-check-input" name="pay" type="radio" value="PAID" />
                      <small className="form-check-label" htmlFor="defaultCheck1" >Paid</small>
                    </div>
                    <div className="form-check" style={{ fontSize: "20px" }} onChange={handleChange} >
                      <input className="form-check-input" name="pay" type="radio" value="UNPAID" />
                      <small className="form-check-label" htmlFor="checkbox">Unpaid</small>
                    </div>
                  </div>
                  {intern.pay === "PAID" && (
                    <TextArea
                      onChange={handleChange}
                      value={intern.stipend}
                      name="stipend"
                      label="Total Amount as Stipend (in INR)"
                      widthp="70%"
                      placeholder='Eg: 50000'
                    />
                  )}
                  <TextArea
                    onChange={handleChange}
                    value={intern.min_cgpa}
                    name="min_cgpa"
                    label="Minimum CGPA Required to Apply (Enter a decimal value between 0 and 10)"
                    widthp="30%"
                    placeholder='7.000'
                  />
                  <div style={{ color: "grey" }}>
                    IITD CGPA Criteria{" "}
                    {/* TODO: Change this */}
                    <Tooltip arrow title="Average CGPA Required for applying for foreign internships is set to 7 CGPA"><i className="fa-solid fa-circle-info"></i></Tooltip>
                  </div>
                </form>
              </div>
            </div>
          )}
          {value === 3 && (
            <div className="w-75">
              <div className="container my-5 mx-5" style={{ width: "90%" }}>
                <BorderLinearProgress variant="determinate" value={100} />
              </div>
              <div className="container my-5 mx-5">
                <form className="my-2 d-flex flex-column align-content-between">
                  <label className="my-3" style={{ fontSize: "15px" }}>
                    Eligible Programs
                  </label>
                  <FormControl
                    sx={{ m: 3 }}
                    component="fieldset"
                    variant="standard"
                  >
                    <FormGroup>
                      <div className="row d-flex">
                        <div className="col-4 ">
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={checkstate.AM}
                                onChange={handleChangeCheck}
                                name="AM"
                              />
                            }
                            label="Applied Mechanics"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={checkstate.BB}
                                onChange={handleChangeCheck}
                                name="BB"
                              />
                            }
                            label="Biotechnology"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={checkstate.CH}
                                onChange={handleChangeCheck}
                                name="CH"
                              />
                            }
                            label="Chemical Engineering"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={checkstate.CS}
                                onChange={handleChangeCheck}
                                name="CS"
                              />
                            }
                            label="Computer Engineering"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={checkstate.CE}
                                onChange={handleChangeCheck}
                                name="CE"
                              />
                            }
                            label="Civil Engineering"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={checkstate.DD}
                                onChange={handleChangeCheck}
                                name="DD"
                              />
                            }
                            label="Design "
                          />
                        </div>
                        <div className="col-1 mx-2"></div>
                        <div className="col-4 ">
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={checkstate.EE}
                                onChange={handleChangeCheck}
                                name="EE"
                              />
                            }
                            label="Electrical Engineering"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={checkstate.ES}
                                onChange={handleChangeCheck}
                                name="ES"
                              />
                            }
                            label="Energy Engineering"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={checkstate.MS}
                                onChange={handleChangeCheck}
                                name="MS"
                              />
                            }
                            label="Material Engineering"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={checkstate.MT}
                                onChange={handleChangeCheck}
                                name="MT"
                              />
                            }
                            label="Mathematics & Computing "
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={checkstate.ME}
                                onChange={handleChangeCheck}
                                name="ME"
                              />
                            }
                            label="Mechanical Engineering"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={checkstate.PH}
                                onChange={handleChangeCheck}
                                name="PH"
                              />
                            }
                            label="Engineering Physics"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={checkstate.TT}
                                onChange={handleChangeCheck}
                                name="TT"
                              />
                            }
                            label="Textile Engineering"
                          />
                        </div>
                      </div>
                    </FormGroup>
                  </FormControl>
                </form>
              </div>
            </div>
          )}
          <div className="container d-flex justify-content-between mx-5">
            <div className="container"></div>
            <div className="container"></div>
            <div className="container ml-auto d-flex ">
              {value !== 1 && (
                <button
                  className="btn-custom-2 mx-2"
                  onClick={() => setValue(value - 1)}
                >
                  Back
                </button>
              )}
              {value !== 3 && (
                <button
                  className="btn-custom-2 mx-2"
                  onClick={() => setValue(value + 1)}
                >
                  Next
                </button>
              )}
              {value === 3 && (
                intern.title.length<1 ||
                intern.field.length<1 ||
                intern.description.length<1 ||
                intern.expected_skills.length<1 ||
                intern.type.length<1 ||
                intern.application_deadline===null ||
                intern.start_date===null ||
                intern.end_date===null
                ?
                <Tooltip arrow placement="top-start" title={<div style={{fontSize: '14px', textAlign: 'center'}}>Please fill all the mandatory fields <br/> (marked with asterices *)</div>}>
                  <div><button className="btn-custom-2 mx-2 btn-custom-2-disabled">
                    Create
                  </button></div>
                </Tooltip>
                :
                <button className="btn-custom-2 mx-2" onClick={handleSubmit}>
                  Create
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

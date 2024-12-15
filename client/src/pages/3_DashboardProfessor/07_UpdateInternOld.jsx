// Packages
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from 'axios'

// Components
import Navbar from './00_Navbar'
import TextArea from './06_TextArea';
import LeftSection from './02_LeftSection'

// MUIU
import Checkbox from '@mui/material/Checkbox';
import { styled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';


export default function UpdateIntern() {
    const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
        height: 10,
        borderRadius: 5,
        [`&.${linearProgressClasses.colorPrimary}`]: {
            backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
        },
        [`& .${linearProgressClasses.bar}`]: {
            borderRadius: 5,
            backgroundColor: theme.palette.mode === 'light' ? 'black' : '#308fe8',
        },
    }));
    const { id } = useParams();
    const getIntern = () => {
        const host = 'http://10.17.50.150/backend';
        const config = {
            headers: { Authorization: `Bearer ${cookies.get('access')}` }
        };
        axios.get(`${host}/api/internship/${id}`, config
        ).then(function (response) {
            setIntern(response.data);
            document.getElementById(response.data.type).checked = true;
            for (var i in response.data.eligible_departments) {
                checkstate[response.data.eligible_departments[i]] = true;
            }
        }).catch(function () {
        })
    }
    useEffect(() => {
        getIntern();
        // eslint-disable-next-line
    }, [])
    const navigate = useNavigate();
    const [checkstate, setCheckState] = useState({
        AM: false,
        BB: false,
        CH: false,
        CS: false,
        CE: false,
        DD: false,
        EE: false,
        EF: false,
        MS: false,
        MT: false,
        ME: false,
        PH: false,
        TT: false,
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
        type: "",
        no_of_offers: "",
        stipend: "",
        min_cgpa: "",
        pay: "",
    })
    const handleChange = (e) => {
        setIntern({ ...intern, [e.target.name]: e.target.value })
    }
    const [value, setValue] = useState(1);
    const handleSubmit = async (e) => {
        e.preventDefault()
        var eligible_departments = [];
        for (var i in checkstate)
            if (checkstate[i] === true) {
                eligible_departments.push(i);
            }
        const { title, field, description, no_of_offers, stipend, type, min_cgpa } = intern
        const host = "http://10.17.50.150/backend";
        const config = {
            headers: { Authorization: `Bearer ${cookies.get('access')}` }
        };
        axios.put(`${host}/api/internship/update/`, {
            "id": id,
            "title": title,
            "field": field,
            "description": description,
            "no_of_offers": +no_of_offers,
            "stipend": +stipend,
            "type": type,
            "min_cgpa": +min_cgpa,
            "eligible_departments": eligible_departments,
        }, config).then(function () {
            alert("Internship Updated Successfully");
            navigate('/dashboard/professor')

        }).catch(function () {
            alert("Error");
        })
    }
    return (
        <div>
            <Navbar />
            <div className="row">
                <LeftSection />
                <div className="col-10 container-screen bg-light" >
                    {value === 1 && <div className='w-75'>
                        <div className="container my-5 mx-5" style={{ width: '90%' }}>
                            <BorderLinearProgress variant="determinate" value={33.33} />
                        </div>
                        <div className="container my-5 mx-5">
                            <form className='my-2 d-flex flex-column align-content-between'>
                                <TextArea onChange={handleChange} value={intern.title} name="title" label="Title of Project" widthp="90%" />
                                <TextArea onChange={handleChange} value={intern.field} name="field" label="Field" widthp="90%" />
                                <TextArea onChange={handleChange} value={intern.description} name="description" label="Description" widthp="90%" />
                                <label className="my-3" style={{ fontSize: '15px' }}>Type of Internship</label>
                                <div>
                                    <div className="form-check" style={{ fontSize: '20px' }} onChange={handleChange}>
                                        <input className="form-check-input" name="type" type="radio" value="REMOTE" id="REMOTE" />
                                        <label className="form-check-label" htmlFor="defaultCheck1">REMOTE</label>
                                    </div>
                                    <div className="form-check" style={{ fontSize: '20px' }} onChange={handleChange}>
                                        <input className="form-check-input" name="type" type="radio" value="ONSITE" id="ONSITE" />
                                        <label className="form-check-label" htmlFor="checkbox">ON SITE</label>
                                    </div>
                                    <div className="form-check" style={{ fontSize: '20px' }} onChange={handleChange}>
                                        <input className="form-check-input" name="type" type="radio" value="HYBRID" id="HYBRID" />
                                        <label className="form-check-label" htmlFor="checkbox">HYBRID</label>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>}
                    {value === 2 && <div className='w-75'>
                        <div className="container my-5 mx-5" style={{ width: '90%' }}>
                            <BorderLinearProgress variant="determinate" value={66.66} />
                        </div>
                        <div className="container my-5 mx-5">
                            <form className='my-2 d-flex flex-column align-content-between'>
                                <TextArea onChange={handleChange} value={intern.no_of_offers} name="no_of_offers" label="Total Number of offers" widthp="30%" />
                                <TextArea onChange={handleChange} value={intern.stipend} name="stipend" label="Amount as Stipend (in INR)" widthp="70%" />
                                <TextArea onChange={handleChange} value={intern.min_cgpa} name="min_cgpa" label="CGPA Required" widthp="30%" />
                            </form>
                        </div>
                    </div>}
                    {value === 3 && <div className='w-75'>
                        <div className="container my-5 mx-5" style={{ width: '90%' }}>
                            <BorderLinearProgress variant="determinate" value={100} />
                        </div>
                        <div className="container my-5 mx-5">
                            <form className='my-2 d-flex flex-column align-content-between'>
                                <label className="my-3" style={{ fontSize: '15px' }}>Eligible Programs</label>
                                <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                                    <FormGroup>
                                        <div className="row d-flex">
                                            <div className="col-4 ">
                                                <FormControlLabel control={<Checkbox checked={checkstate.AM} onChange={handleChangeCheck} name="AM" id="AM" />} label="Applied Mechanics" />
                                                <FormControlLabel control={<Checkbox checked={checkstate.BB} onChange={handleChangeCheck} name="BB" id="BB" />} label="Biotechnology" />
                                                <FormControlLabel control={<Checkbox checked={checkstate.CH} onChange={handleChangeCheck} name="CH" id="CH" />} label="Chemical Engineering" />
                                                <FormControlLabel control={<Checkbox checked={checkstate.CS} onChange={handleChangeCheck} name="CS" id="CS" />} label="Computer Engineering" />
                                                <FormControlLabel control={<Checkbox checked={checkstate.CE} onChange={handleChangeCheck} name="CE" id="CE" />} label="Civil Engineering" />
                                                <FormControlLabel control={<Checkbox checked={checkstate.DD} onChange={handleChangeCheck} name="DD" id="DD" />} label="Design " />
                                            </div>
                                            <div className="col-1 mx-2">
                                            </div>
                                            <div className="col-4 ">
                                                <FormControlLabel control={<Checkbox checked={checkstate.EE} onChange={handleChangeCheck} name="EE" id="EE" />} label="Electrical Engineering" />
                                                <FormControlLabel control={<Checkbox checked={checkstate.ES} onChange={handleChangeCheck} name="ES" id="ES" />} label="Energy Engineering" />
                                                <FormControlLabel control={<Checkbox checked={checkstate.MS} onChange={handleChangeCheck} name="MS" id="MS" />} label="Material Engineering" />
                                                <FormControlLabel control={<Checkbox checked={checkstate.MT} onChange={handleChangeCheck} name="MT" id="MT" />} label="Mathematics & Computing " />
                                                <FormControlLabel control={<Checkbox checked={checkstate.ME} onChange={handleChangeCheck} name="ME" id="ME" />} label="Mechanical Engineering" />
                                                <FormControlLabel control={<Checkbox checked={checkstate.PH} onChange={handleChangeCheck} name="PH" id="PH" />} label="Engineering Physics" />
                                                <FormControlLabel control={<Checkbox checked={checkstate.TT} onChange={handleChangeCheck} name="TT" id="TT" />} label="Textile Engineering" />
                                            </div>
                                        </div>
                                    </FormGroup>
                                </FormControl>
                            </form>
                        </div>
                    </div>}
                    <div className="container d-flex justify-content-between mx-5" >
                        <div className="container">
                        </div>
                        <div className="container"></div>
                        <div className="container ml-auto d-flex ">
                            {value !== 1 && <button className='btn-custom-2 mx-2' onClick={() => setValue(value - 1)}>Back</button>}
                            {value !== 3 && <button className='btn-custom-2 mx-2' onClick={() => setValue(value + 1)}>Next</button>}
                            {value === 3 && <button className='btn-custom-2 mx-2' onClick={handleSubmit}>Create</button>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

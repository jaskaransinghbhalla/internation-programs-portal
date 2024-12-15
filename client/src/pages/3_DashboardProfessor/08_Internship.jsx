// Packages
import React ,{ useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'
import Cookies from 'universal-cookie'
import dayjs from 'dayjs';
import { CircularProgress } from "@mui/material";

// Components
import './file.css'
import Navbar from './00_Navbar'
import LeftSection from './02_LeftSection';
import SimpleAccordion2 from './10_SimpleAccordion2';

export default function InternProf() {
    const refresh = () => window.location.reload(true)
    const navigate = useNavigate();
    let { id } = useParams();
    const cookies = new Cookies();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({eligible_departments: []});
    const [page, setPage] = useState(1);
    const depts={
        'AM': 'Applied Mechanics',
        'BB': 'Biochemical Engineering and Biotechnology',
        'CH': 'Chemical Engineering',
        'CS': 'Computer Science and Engineering',
        'CE': 'Civil Engineering',
        'DD': 'Design',
        'EE': 'Electrical Engineering',
        'ES': 'Energy Engineering',
        'MS': 'Materials Engineering',
        'MT': 'Mathematics and Computing',
        'ME': 'Mechanical Engineering',
        'PH': 'Engineering Physics',
        'TT': 'Textile Technology'
    }
    const getIntern = () => {
        const host = 'http://10.17.50.150/backend';
        const config = {
            headers: { Authorization: `Bearer ${cookies.get('access')}` }
        };
        setLoading(true);
        axios.get(`${host}/api/internship/${id}`, config
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
    useEffect(() => {
        getIntern();
        // eslint-disable-next-line
    }, [])
    const handleShortlist = (email) => {
        const host = 'http://10.17.50.150/backend';
        const config = {
            headers: { Authorization: `Bearer ${cookies.get('access')}` }
        };
        setLoading(true);
        axios.post(`${host}/api/internship/shortlist/`, {
            'internship_id': id,
            'email': email
        }, config
        ).then(function () {
            setLoading(false);
            refresh()
        }).catch(function (error) {
            setLoading(false);
            if (error.response.status === 401) {
                alert("Session Expired. Please login again.");
                navigate("/");
            }else{
                alert("Something went wrong. Please try again later. If the problem persists, please contact admin.")
            }
        })
    }
    const handleUnshortlist = (email) => {
        const host = 'http://10.17.50.150/backend';
        const config = {
            headers: { Authorization: `Bearer ${cookies.get('access')}` }
        };
        setLoading(true);
        axios.post(`${host}/api/internship/unshortlist/`, {
            'internship_id': id,
            'email': email
        }, config
        ).then(function () {
            setLoading(false);
            refresh()
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
    const handleDelete = () => {
        const host = 'http://10.17.50.150/backend';
        const config = {
            headers: { Authorization: `Bearer ${cookies.get('access')}` }
        };
        setLoading(true);
        axios.delete(`${host}/api/internship/delete/${id}`, config
        ).then(function () {
            setLoading(false);
            navigate('/professor/dashboard')
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
    const handleSummary = () => {
        setPage(1)
    }
    const handleApplied = () => {
        setPage(2)
    }
    const handleShortlisted = () => {
        setPage(3)
    }
    function Summary() {
        return (
            <div>
                <h4 className='mx-5 my-4 col-8'>About the Project</h4>
                <div className='px-5 my-2 row'>
                    <h6 className='col-3'>Field</h6>
                    <div className='col-8'>{data.field}</div>
                </div>
                <div className='px-5 my-2 row'>
                    <h6 className='col-3'>Description</h6>
                    <div className='col-8'>{data.description}</div>
                </div>
                <div className='px-5 my-2 row'>
                    <h6 className='col-3'>Mode</h6>
                    <div className='col-8'>{data.type}</div>
                </div>
                <div className='px-5 my-2 row'>
                    <h6 className='col-3'>Duration</h6>
                    <div className='col-8'>{dayjs(data.start_date).format("D MMMM YYYY")} - {dayjs(data.end_date).format("D MMMM YYYY")}</div>
                </div>
                <div className='px-5 my-2 row'>
                    <h6 className='col-3'>Number of Offers</h6>
                    <div className='col-8'>{data.no_of_offers}</div>
                </div>
                <div className='px-5 my-2 row'>
                    <h6 className='col-3'>Stipend</h6>
                    <div className='col-8'>INR {data.stipend}</div>
                </div>
                <h4 className='mx-5 my-4 col-8'>Eligibility and Application Details</h4>
                <div className='px-5 my-2 row'>
                    <h6 className='col-3'>Expected Skills</h6>
                    <div className='col-8'>{data.expected_skills}</div>
                </div>
                <div className='px-5 my-2 row'>
                    <h6 className='col-3'>Application Deadline</h6>
                    <div className='col-8'>{dayjs(data.application_deadline).format("D MMMM YYYY")}</div>
                </div>
                <div className='px-5 my-2 row'>
                    <h6 className='col-3'>Minimum CGPA</h6>
                    <div className='col-8'>{data.min_cgpa}</div>
                </div>
                <div className='px-5 my-2 row'>
                    <h6 className='col-3'>Eligible Departments</h6>
                    <div className='col-8'>
                        {data.eligible_departments.map((dept) => {
                            return (
                                <div key={dept}>{depts[dept]}</div>
                            )
                        })}
                    </div>
                </div>
                <div className='mx-5'>
                    <Link to={`/professor/internship/update/${data.id}`} className="btn btn-secondary mt-3 mb-5 mx-2" >Update</Link>
                    <button onClick={() => { if (window.confirm('Are you sure you want to delete this internship? This action is irreversible.')) { handleDelete() }; }} className="btn btn-danger mt-3 mb-5 mx-2" >Delete</button>
                </div>
            </div>
        )
    }
    function Applied() {
        return (
            <div>
                <h4 className='mx-5 my-4 col-8'>Applied</h4>
                <div className='col-10'>
                    {data.applications.filter((app) => {return !app.is_shortlisted}).map((application) => {
                        return (
                            <div key={application.id} className='row'>
                                <div className='col-8'>
                                    <SimpleAccordion2 statement_of_purpose={application.statement_of_purpose} student={application.student} />
                                </div>
                                <div className='col-1'>
                                    <button onClick={() => { handleShortlist(application.student.email) }} className='btn-custom-2 my-1'>Shortlist</button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
    function Shortlisted() {
        return (
            <div>
                <h4 className='mx-5 my-4 col-8'>Shortlisted</h4>
                <div className='col-10'>
                    {data.applications.filter((app) => {return app.is_shortlisted}).map((application) => {
                        return (
                            <div key={application.id} className='row'>
                                <div className='col-8'>
                                    <SimpleAccordion2 statement_of_purpose={application.statement_of_purpose} student={application.student} />
                                </div>
                                <div className='col-1'>
                                    <button onClick={() => { handleUnshortlist(application.student.email) }} className='btn-custom-2 my-1'>Un-shortlist</button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
    return (
        <div>
            <Navbar />
            <div className='row'>
                <LeftSection />
                <div className={loading? 'loading col-10 container-screen bg-light' : 'col-10 container-screen bg-light'} >
                    {loading && <CircularProgress style={{width: '100px', height: '100px'}} className='progress-circle' />}
                    <div className='row'>
                        <div className='col-7'>
                            <h2 className='mt-5 mx-5'>{data.title}</h2>
                        </div>
                        <div className='col-2 mt-5 mx-5'>
                            <div className='btn-group' role='group'>
                                <button type='button' className='btn btn-custom-1' onClick={handleSummary}>Summary</button>
                                <button type='button' className='btn btn-custom-1' onClick={handleApplied}>Applied</button>
                                <button type='button' className='btn btn-custom-1' onClick={handleShortlisted}>Shortlisted</button>
                            </div>
                        </div>
                    </div>
                    <div>
                        { page === 1 ? <Summary /> : null }
                        { page === 2 ? <Applied /> : null }
                        { page === 3 ? <Shortlisted /> : null }
                    </div>
                </div>
            </div>
        </div>
    )
}

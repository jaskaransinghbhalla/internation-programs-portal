import React from 'react'
import { Link } from 'react-router-dom'

export default function LeftSectionStu() {
    return (
        <div className="col-2 container" style={{ backgroundColor: "#DADADA" }}>
            <div className='row py-5' >
                <div className='left-btn py-3'>
                    <Link className="h4 text-decoration-none text-dark" style={{ paddingLeft: "35px" }} to='/dashboard/student'>
                        Dashboard
                    </Link>
                </div>
                <div className='left-btn py-3'>
                    <Link className="h4 text-decoration-none text-dark" style={{paddingLeft : "35px"}} to='/dashboard/student/applications'>
                        Applications
                    </Link>
                </div>
            </div>
        </div >
    )
}

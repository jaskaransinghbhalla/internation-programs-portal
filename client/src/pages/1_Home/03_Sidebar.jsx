import React from 'react'
import { Link } from 'react-router-dom'

const Sidebar = () => {
    return (
        <div className="col-4 bg-second container " style={{ paddingTop: "270px" }}>
            <h3 className='m-1'>
                New to Platform?
            </h3>
            <h3 className='my-1'>
                Don't worry, Sign Up!
            </h3>
            <div className="col d-flex justify-content-center">
                <Link to="/signup/student" type='submit' className="btn btn-dark btn-lg w-25 mx-2 my-3 px-2">Student</Link>
                <Link to="/signup/professor" type='submit' className="btn btn-dark btn-lg w-25 mx-2 my-3 px-2">Professor</Link>
            </div>
        </div>
    )
}
export default Sidebar
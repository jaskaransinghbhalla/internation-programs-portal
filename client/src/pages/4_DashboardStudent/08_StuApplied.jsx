import React, { useState } from 'react'
import Navbar from '../../components/Navbar'
import LeftSectionStu from '../../components/LeftSectionStu'

export default function StuApplied(props) {
    const [summaryShown, summaryIsShown] = useState(true);
    const [statusShown, statusIsShown] = useState(false);
    const handleSummary = () => {
        summaryIsShown(true)
        statusIsShown(false)
    }
    const handleStatus = () => {
        summaryIsShown(false)
        statusIsShown(true)
    }
    function Summary() {
        return (
            <div className="row">
                <div className='col'>
                    <h5 className='mx-5'>Internship ABC</h5>
                    <p className='mx-5'>Status - In Process</p>
                </div>
            </div>

        )
    }
    function Status() {
        return (
            <div className="row">
                <div className='col'>
                    <h5 className='mx-5 my-3'>Internship ABC</h5>
                    <p className='mx-5'>Status - In Process</p>
                </div>
            </div>
        )
    }
    return (
        <div>
            <Navbar />
            <div className="row ">
                <LeftSectionStu />
                <div className="col-10 container-screen bg-light" >
                    <div className="row">
                        <div className="col-8">
                            <h3 className='mt-5 mx-5'>Internship ABC</h3>
                        </div>
                        <div className="col-2 mt-5 mx-5">
                            <div class="btn-group" role="group" aria-label="Basic example">
                                <button type="button" className="btn btn-custom-1" onClick={handleSummary}>Summary</button>
                                <button type="button" className="btn btn-custom-1" onClick={handleStatus}>Status</button>
                            </div>
                        </div>
                    </div>
                    <div>
                        {summaryShown ? <Summary /> : null}
                        {statusShown ? <Status /> : null}
                    </div>
                </div>
            </div>
        </div>
    )
}

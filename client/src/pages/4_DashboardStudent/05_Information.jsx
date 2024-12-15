import React from 'react'
import Placeholder from '../../components/Placeholder'
import Button from '../../components/Button-dark.jsx'
import Button2 from '../../components/Button-light.jsx'

export default function Information() {
    return (
        <div className="text-center">
            <div className="row">
                <div className="col-4 bg-second ">
                    <h3 className='m-5'>Are you a Professor or a Student?</h3>
                    <Button2 text='Login' />
                </div>
                <div className="col-8">
                    <div className="container-screen mt-5">
                        <h3>Name, add additional details for account</h3>
                        <div className="form-wrapper d-flex flex-column justify-content-center align-items-center">
                            <Placeholder name='department' text='Department' type='text' />
                            <Placeholder name='program' text='Program' type='text' />
                            <Placeholder name='cgpa' text='CGPA' type='text' />
                            <Button text='Back' />
                            <Button text='Next' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


import React from 'react'
import dayjs from 'dayjs'

export default function Notification(props) {
    let day_obj = dayjs(props.time)
    let disp_time
    if (dayjs().diff(day_obj, 'day') === 0) {
        disp_time = "Today, "+day_obj.format("H:mm").toString()
    } else {
        disp_time = day_obj.format("D MMM, H:mm")
    }
    return (
        <div className="container ml-2">
            <small  style={{color : "#505050"}} className='my-1 py-1'>{disp_time}</small>
            <p className='my-1 py-1'>{props.description}</p>
            <hr />
        </div>
    )
}


import React from 'react'

export default function TextArea(props) {
    return (
        <div className="form-group my-3">
            <label htmlFor="titleOfProject" style={{ fontSize: '15px' }}>{props.label}</label>
            <input type="text" value={props.value} name={props.name} className="form-control" id="titleOfProject" onChange={props.onChange} style={{ width: `${props.widthp}` }} placeholder={props.placeholder && props.placeholder} />
        </div>
    )
}

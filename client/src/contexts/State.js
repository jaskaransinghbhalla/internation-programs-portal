import Context from "./Context";
import React, { useState } from "react";

const State = (props) => {
    // OTP
    const [otp, setOtp] = useState({
        digit1: "",
        digit2: "",
        digit3: "",
        digit4: "",
        digit5: "",
        digit6: "",

    })
    const handleOTPChange = (e) => {
        setOtp({ ...otp, [e.target.name]: e.target.value })
    }
    const finalOTP = otp.digit1 + otp.digit2 + otp.digit3 + otp.digit4 + otp.digit5 + otp.digit6;
    return (
        <Context.Provider value={{ finalOTP, otp, handleOTPChange }}>
            {props.children}
        </Context.Provider>
    )
}
export default State;
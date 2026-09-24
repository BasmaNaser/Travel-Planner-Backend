const nodemailer = require('nodemailer')
require('dotenv').config()

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASS
    }
})

async function sendOtpEmail(otp, email) {
    const emailSended = await transporter.sendMail({
        from: process.env.USER_EMAIL,
        to: email,
        subject: 'Travel Planner - Verification Code',

       html: `
    <div style="
        margin: 0;
        padding: 40px 20px;
        background-color: #f4f7f8;
        font-family: Arial, Helvetica, sans-serif;
    ">

        <div style="
            max-width: 550px;
            margin: auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 5px 20px rgba(0,0,0,0.08);
        ">

            <!-- Header -->
            <div style="
                background-color: #0ea5a8;
                padding: 30px;
                text-align: center;
            ">
                <h1 style="
                    margin: 0;
                    color: #ffffff;
                    font-size: 30px;
                    letter-spacing: 1px;
                ">
                    Travel Planner
                </h1>

                <p style="
                    margin: 8px 0 0;
                    color: #e8ffff;
                    font-size: 14px;
                ">
                    Your journey starts here ✈️
                </p>
            </div>


            <!-- Content -->
            <div style="
                padding: 35px 30px;
                text-align: center;
            ">

                <h2 style="
                    margin: 0 0 15px;
                    color: #1f2937;
                    font-size: 24px;
                ">
                    Verify Your Email
                </h2>

                <p style="
                    margin: 0 auto 25px;
                    color: #6b7280;
                    font-size: 15px;
                    line-height: 1.7;
                    max-width: 420px;
                ">
                    Thank you for joining Travel Planner!
                    Please use the verification code below to complete
                    your account registration.
                </p>


                <!-- OTP Box -->
                <div style="
                    display: inline-block;
                    padding: 18px 35px;
                    background-color: #f0fafa;
                    border: 2px dashed #0ea5a8;
                    border-radius: 12px;
                    margin: 10px 0 25px;
                ">

                    <p style="
                        margin: 0 0 8px;
                        color: #6b7280;
                        font-size: 12px;
                        text-transform: uppercase;
                        letter-spacing: 2px;
                    ">
                        Verification Code
                    </p>

                    <h1 style="
                        margin: 0;
                        color: #0ea5a8;
                        font-size: 38px;
                        letter-spacing: 8px;
                    ">
                        ${otp}
                    </h1>

                </div>


                <p style="
                    margin: 0;
                    color: #ef4444;
                    font-size: 14px;
                    font-weight: bold;
                ">
                    ⏱ This code will expire in 5 minutes.
                </p>


                <p style="
                    margin: 20px 0 0;
                    color: #9ca3af;
                    font-size: 13px;
                    line-height: 1.6;
                ">
                    If you didn't request this verification code,
                    you can safely ignore this email.
                </p>

            </div>


            <!-- Footer -->
            <div style="
                background-color: #f8fafc;
                padding: 20px;
                text-align: center;
                border-top: 1px solid #e5e7eb;
            ">

                <p style="
                    margin: 0;
                    color: #9ca3af;
                    font-size: 12px;
                ">
                    © 2026 Travel Planner. All rights reserved.
                </p>

                <p style="
                    margin: 6px 0 0;
                    color: #0ea5a8;
                    font-size: 12px;
                ">
                    Explore. Plan. Travel. ✈️
                </p>

            </div>

        </div>

    </div>
`
    })

    return emailSended
}

module.exports = sendOtpEmail

const nodemailer = require('nodemailer')
require('dotenv').config()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    tls: {
        rejectUnauthorized: false
    },

    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASS
    }
})

async function sendResetPasswordEmail(email, resetLink) {

    const emailSended = await transporter.sendMail({

        from: process.env.USER_EMAIL,

        to: email,

        subject: 'Travel Planner - Reset Password',

        html: `
            <div style="
                margin:0;
                padding:40px 20px;
                background:#f4f7f8;
                font-family:Arial,sans-serif;
            ">

                <div style="
                    max-width:550px;
                    margin:auto;
                    background:white;
                    border-radius:16px;
                    overflow:hidden;
                    box-shadow:0 5px 20px rgba(0,0,0,.08);
                ">

                    <div style="
                        background:#0ea5a8;
                        padding:30px;
                        text-align:center;
                    ">

                        <h1 style="
                            margin:0;
                            color:white;
                        ">
                            Travel Planner ✈️
                        </h1>

                    </div>

                    <div style="
                        padding:35px;
                        text-align:center;
                    ">

                        <h2 style="
                            color:#1f2937;
                        ">
                            Reset Your Password
                        </h2>

                        <p style="
                            color:#6b7280;
                            line-height:1.7;
                        ">
                            We received a request to reset your password.
                            Click the button below to create a new password.
                        </p>

                        <a href="${resetLink}" style="
                            display:inline-block;
                            margin:20px 0;
                            padding:14px 30px;
                            background:#0ea5a8;
                            color:white;
                            text-decoration:none;
                            border-radius:8px;
                            font-weight:bold;
                        ">
                            Reset Password
                        </a>

                        <p style="
                            color:#ef4444;
                            font-size:14px;
                            font-weight:bold;
                        ">
                            This link will expire in 15 minutes.
                        </p>

                        <p style="
                            color:#9ca3af;
                            font-size:13px;
                        ">
                            If you didn't request a password reset,
                            you can safely ignore this email.
                        </p>

                    </div>

                    <div style="
                        padding:20px;
                        text-align:center;
                        background:#f8fafc;
                    ">

                        <p style="
                            margin:0;
                            color:#9ca3af;
                            font-size:12px;
                        ">
                            © 2026 Travel Planner
                        </p>

                    </div>

                </div>

            </div>
        `
    })

    return emailSended
}

module.exports = sendResetPasswordEmail
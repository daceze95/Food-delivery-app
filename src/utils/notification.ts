import twilio from 'twilio'
import { fromAdminPhone, authToken, accountSid,GMAIL_PW, GMAIL_USER,FromAdminMail, userSubject } from '../config'
import nodemailer from 'nodemailer'
import { STRING } from 'sequelize'

export const GenerateOtp = () => {
    const otp = Math.floor(1000 + Math.random() * 9000)
    const expiry = new Date()

    expiry.setTime(new Date().getTime() + ( 30 * 60 * 1000))
    return {otp, expiry}
}

// export const requestOTP = async(otp:number, toPhoneNumber:string) => {
//     const client = twilio(accountSid, authToken);

//     const response = await client.messages 
//       .create({
//             body: `Your OTP is ${otp}`,         
//             to: toPhoneNumber,
//             from: fromAdminPhone, 
//        }) 
//     return response;
// } 

// service and host are thesame
//create a transporter object
const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_PW,
    },
    tls:{
        rejectUnauthorized:false,
    }
});

// interface mailInfo {
//     from:string,
//     to:string,
//     subject:string,
//     text:string,
//     html:string,
// }

export const mailSender = async(
    from:string,
    to:string,
    subject:string,
    html:string,) => {

        try {

            const response = await transport.sendMail({
                from: FromAdminMail,
                subject: userSubject,
                to,
                html
            })
            return response;

        } catch(error) {
            console.log(error)
        }

}

export const emailHtml = (otp:number) => {
    let response = `
    <body style=" max-width:700px; height:auto; margin:auto; border:10px solid #ddd;">
        <header style="text-align:center; height:auto; padding:30px 20px; background-color:maroon;">
            <h1 style=" margin:5px auto; text-transform:uppercase; font-size:1.2em; color:white;">
                Welcome to <b>${userSubject}</b>
            </h1>
        </header>
        
            <p style="text-align:center;">Your otp is 👇 👇 👇 </p>
            <p style="text-align:center; color:blue; font-size:1em;"><b>${otp}</b></p>
        <footer style="background-color:maroon; padding:3px auto ; text-align:center; margin-bottom:none"><p style="color:white; margin:none;">copyright&copy;Dac Store 2022</p></footer> 
    </body>
    `
    return response;
}
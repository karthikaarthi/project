require("dotenv").config();
const twilio = require("twilio");


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid,authToken)


async function sendWhatsAppMessage (to, message) {
    try {
        console.log(process.env.TWILIO_ACCOUNT_PH_NO,'df',to)
        const response = await client.messages.create({
            from: `whatsapp:${process.env.TWILIO_ACCOUNT_PH_NO}`,
            to: `whatsapp:${to}`,
            body: message
        })
        console.log("Whatsapp message sent: ",response.sid)
    }catch(err){
        console.error("Error sending whatsapp message: ",err)
    }


}


module.exports = {sendWhatsAppMessage}
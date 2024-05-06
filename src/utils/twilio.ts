import twilio from "twilio";
class Twilio{
    client:any;
    serviceSid:string;
    constructor(accontSid:string,authToken:string,serviceSid:string){
        this.client=twilio(accontSid,authToken)
        this.serviceSid=serviceSid
        }
        sendOtp(toNumber:string){
            return this.client.verify.v2.services(this.serviceSid)
            .verifications
            .create({to:`+91${toNumber}`,channel:'sms'})
        }

        verifyCode(toNumber:string,verificatonCode:string){
            return this.client.verify.v2.services(this.serviceSid)
            .verificationCheck
            .create({to:`+91${toNumber}`,code:verificatonCode})
        }
}
export default Twilio
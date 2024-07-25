"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const twilio_1 = __importDefault(require("twilio"));
class Twilio {
    constructor(accontSid, authToken, serviceSid) {
        this.client = (0, twilio_1.default)(accontSid, authToken);
        this.serviceSid = serviceSid;
    }
    sendOtp(toNumber) {
        return this.client.verify.v2.services(this.serviceSid)
            .verifications
            .create({ to: `+91${toNumber}`, channel: 'sms' });
    }
    verifyCode(toNumber, verificatonCode) {
        return this.client.verify.v2.services(this.serviceSid)
            .verificationCheck
            .create({ to: `+91${toNumber}`, code: verificatonCode });
    }
}
exports.default = Twilio;

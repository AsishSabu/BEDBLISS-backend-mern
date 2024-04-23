import transporter from "../frameworks/services/mailServices";

const sendMail=async(
    email:string,
    emailSubject:string,
    content:string
)=>{
    try {
        const info = await transporter.sendMail({
          from: 'BedBliss <bedbliss0101@gmail.com>',
          to: email,
          subject: emailSubject,
          html: content,
        });
    
        console.log(`Email sent to ${email} : `, info.messageId);
      } catch (error) {
        console.log("Error in sending mail:", error);
      }
    
}
export default sendMail;
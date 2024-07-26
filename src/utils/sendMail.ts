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
    
      } catch (error) {
      }
    
}
export default sendMail;
import emailjs from "emailjs-com";

export default function sendEmail(content, username) {
    emailjs.init("hjkkL6TtpBRBqKNxZ");
    const serviceID = "service_mbg89ee";
    const templateID = "template_orx5zxh";
  
    const emailParams = {
      from_name: username,
      subject: "StockScope Ticket",
      message: content,
    };
  
    return emailjs
      .send(serviceID, templateID, emailParams)
      .then((response) => {
        console.log("Email sent successfully", response.status, response.text);
      })
      .catch((err) => {
        console.error("Email sending failed", err);
      });
  };
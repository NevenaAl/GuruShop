import { v4 as uuidv4 } from 'uuid';
import { Redis } from 'ioredis';
import * as nodemailer  from 'nodemailer'

export const createConfirmationLink = async (url: String, redis: Redis, userId: String) => {
    const id = uuidv4()
    const link = `${url}/confirmMail/${id}`;
    await redis.set(id, userId);

    return link;
}

export const sendConfirmationMail = async (link: String,mail: String) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, 
        auth: {
            user: 'jettie41@ethereal.email',
            pass: 'QbSKN3NrMgC2v8QrEu'
        }
    });

    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: mail, // list of receivers
        subject: "Cofirm mail", // Subject line
        text: "Hello world?", // plain text body
        html: `<a href='${link}'>Cofirm mail</a> to finish your registration!`, 
    });

    console.log("Message sent: %s", info.messageId);

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

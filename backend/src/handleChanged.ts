import { Subject } from './scrape-subject';
import { saveSubjectState } from './subjectState';
import nodemailer from 'nodemailer';

/**
 * Handle changed Subject
 */
export async function handleChanged(oldSubject: Subject, newSubject: Subject): Promise<void> {
    console.log(`${newSubject.name} (${newSubject.code}) changed`);

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.MAIL_USENAME,
            pass: process.env.MAIL_PASSWORD,
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: `"TAD Figyelő" <${process.env.MAIL_USENAME}>`, // sender address
        to: process.env.MAIL_SEND_ADDRESS, // list of receivers
        subject: `[TAD Figyelő]: Tárgyhonlap változás (${oldSubject.code})`, // Subject line
        html:
            `<html lang='hu'>` +
            `<body>` +
            `<h2>${oldSubject.name} (${oldSubject.code}) => ${newSubject.name} (${newSubject.code}) megváltozott!</h2>` +
            `<p>Tárgyhonlap link: <a target='_blank' href='${newSubject.url}'><b>${newSubject.url}</b></a></p>` +
            `<p>Változás megtekinthető az alább linken: <a target='_blank' href='${
                `http://` + process.env.BASE_URL + '/diff/' + newSubject.code
            }'><b>${`http://` + process.env.BASE_URL + '/diff/' + newSubject.code}</b></a></p>` +
            `<p>Változás észlelésének ideje: <b>${newSubject.createdAt}</b></p>` +
            `</body>` +
            `</html>`, // html body
    });

    console.log('Message sent: %s', info.messageId);

    //Save the new subject
    await saveSubjectState(newSubject);
}

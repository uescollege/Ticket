
const nodemailer = require('nodemailer');
const CryptoJS = require("crypto-js");
const pug = require('pug');
const path = require("path");
const config = require("../config/index");

class SendEmail  {
  constructor (data, correo) {
    this.data = data;
    this.correo = correo;
  }

  /**
   * @description crea el transporter para enviar el email
   * @returns 
   */
  crearTransporter = () => {
    let password = CryptoJS.AES.decrypt(this.correo.smtp_password, config.SECRET || 'secret').toString(CryptoJS.enc.Utf8);

    if (typeof password == undefined || password == "") {
        password = this.correo.smtp_password;
    } 

    return nodemailer.createTransport({
      host: this.correo.smtp_host,
      service: this.correo.smtp_service, //
      // service: 'gmail',
      port: this.correo.smtp_port,
      auth: {
        user: this.correo.smtp_user,
        pass: password
      },
      tls: {
        rejectUnauthorized: true,
      }
    });
  }

  generarEmailHtml = (toEmail, view = "ejemplo.pug", subject = "", data = {}) => {
    return {
      from: this.correo.smtp_from,
      to: toEmail,
      subject,
      html: pug.renderFile(
        path.join(__dirname, "../views/email-template/", view),
        data
      )
    }
  }

  sendEmail = async (toEmail, subject, template) => {
    const transporter = this.crearTransporter();

    const mailOptions = this.generarEmailHtml(toEmail, template, subject, this.data);

    return await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, async function (error, info) {
        if (info) {
          resolve(info);
        } else {
          console.error("Error al enviar email", error)
          reject(error);
        }
      });
    });
  }


}

module.exports = SendEmail
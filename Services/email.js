// Je vais utiliser un service de développement speciale qui fait semblant d'envoyer des emails à des vraies adresses. Mais en réalité ces emails se retrouvent piégés dans une boîte de réception de développement de sorte que nous pouvons ensuite voir à quoi ressemble cet email ! Pour ensuite être sûr De ce que j'enverrai quand le site sera en production.

const nodemailer = require('nodemailer');
const pug = require('pug');
const { htmlToText } = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firsName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Holiday Experience <${process.env.SENDGRID_EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Sendgrid
      return nodemailer.createTransport(
        {
          host: 'in.mailsac.com',
          secure: false, // use SSL
          port: 25, // port for secure SMTP
          service: 'SendGrid',
          auth: {
            user: process.env.SENDGRID_USERNAME,
            pass: process.env.SENDGRID_PASSWORD,
          },
          tls: {
            rejectUnauthorized: false
          }
        }
      );
    }
    // 2) Je crée un transporteur en utilisant le "NODEMAILER" qui aura pour objectif d'envoyer un mail .
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  //SEND THE ACTUAL EMAIL
  async send(template, subject) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    // 2) Je définis les options du mail.
    // Je définis les options en utilisant le paramètres objet "options" de la fonction SENDEMAIL et lui déclare des arguments .
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html),
    };

    // 3) create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('Welcome', 'Welcome to the HoliBody Family!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)'
    );
  }
};
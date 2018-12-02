const nodemailer = require('nodemailer')
const isEmpty = require('../utils')

class Mail {
  constructor() {
    this.user = 'donotreply.matcha@gmail.com'
    this.pass = 'm4tch4.S3cur3`P4ssw0rd/*'
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.user,
        pass: this.pass,
      },
    })
  }

  send({
    to,
    subject,
    text,
    html,
  }) {
    const mailOptions = { from: this.user }
    if (!isEmpty(to)) Object.assign(mailOptions, { to })
    if (!isEmpty(subject)) Object.assign(mailOptions, { subject })
    if (!isEmpty(text)) Object.assign(mailOptions, { text })
    if (!isEmpty(html)) Object.assign(mailOptions, { html })
    return new Promise((resolve, reject) => {
      this.transporter.sendMail(mailOptions, (err, res) => {
        if (!isEmpty(err)) reject(err)
        resolve(res)
      })
    })
  }
}

module.exports = Mail

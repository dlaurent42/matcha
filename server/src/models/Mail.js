const nodemailer = require('nodemailer')
const { isEmpty } = require('../utils')

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

  send(mailOptions) {
    return new Promise((resolve, reject) => {
      this.transporter.sendMail(mailOptions, (err, res) => {
        if (!isEmpty(err)) return reject(err)
        return resolve(res)
      })
    })
  }

  registration(user) {
    const mailOptions = {
      from: this.user,
      to: user.email,
      subject: 'Registration',
      text: `Please click here: http://localhost:8082/account?token=${user.registrationToken}`,
    }
    return this.send(mailOptions)
  }
}

module.exports = Mail

const nodemailer = require('nodemailer')
const { isEmpty } = require('../utils')
const { MAIL } = require('../config/config')

class Mail {
  constructor() {
    this.user = MAIL.USER
    this.pass = MAIL.PASS
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

  registration(user, redirectUri) {
    const mailOptions = {
      from: this.user,
      to: user.email,
      subject: 'Registration',
      text: `Please click here: ${redirectUri}?token=${user.registrationToken}`,
    }
    return this.send(mailOptions)
  }

  passwordRecovery(user, token, redirectUri) {
    const mailOptions = {
      from: this.user,
      to: user.email,
      subject: 'Recover password',
      text: `Please click here: ${redirectUri}?token=${token}`,
    }
    return this.send(mailOptions)
  }

  reportUser(emitter, receiver) {
    const mailOptions = {
      from: this.user,
      to: emitter.email,
      subject: 'Report user',
      text: `Thanks for reporting ${receiver.username}.`,
    }
    return this.send(mailOptions)
  }

  warnAdminOfUserReporting(emitter, receiver) {
    const mailOptions = {
      from: this.user,
      to: this.user,
      subject: '[REPORT] User has been reported',
      text: `${emitter.username} [${emitter.email}] has reported ${receiver.username} [${receiver.email}] as fake user.`,
    }
    return this.send(mailOptions)
  }
}

module.exports = Mail

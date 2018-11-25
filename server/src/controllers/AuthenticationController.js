module.exports = {
  async register(req, res) { // eslint-disable-line 
    try {
      const user = await User.create(req.body)
      res.send(user.toJSON())
    } catch (err) {
      res.status(400).send({
        error: 'This email account is already in use.',
      })
    }
  },
}

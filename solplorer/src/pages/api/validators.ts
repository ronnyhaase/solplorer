const validators = require('../../../data/validators.json')

const handler = async (req, res) => {
  res.status(200).json({
    validators,
  })
}

export default handler

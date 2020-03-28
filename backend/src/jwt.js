const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const secret = crypto.randomBytes(256).toString('base64');

const sign = (payload) => jwt.sign(payload, secret, { expiresIn: '6h' });
const verify = (token) => jwt.verify(token, secret);

module.exports = {
    sign,
    verify
}

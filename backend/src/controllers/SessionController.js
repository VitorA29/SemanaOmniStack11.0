const connection = require('../database/connection');
const jwt = require('../jwt');

module.exports = {
    async create(request, response) {
        const { id } = request.body;

        const ong = await connection('ongs')
            .where({ id })
            .select('name')
            .first();

        if (!ong) {
            return response.status(400).json({ error: 'No ONG found with this ID' });
        }

        return response.json(ong);
    },
    async login(req, res) {
        const [ , hash ] = req.headers.authorization.split(' ');
        const [ login, password ] = Buffer.from(hash, 'base64').toString().split(':');

        console.log(login, password);
        // access database and validate credentials

        // create a token using the item id
        const token = jwt.sign({ identifier: 'TODO' });
        res.send({ token });
    }
};

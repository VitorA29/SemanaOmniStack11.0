const connection = require('../database/connection');
const KeyGenerator = require('../utils/key-generator');

const brazilCode = '+55';

module.exports = {
    async create(request, response) {
        const { name, email, whatsapp, city, uf } = request.body;

        const id = KeyGenerator.generateUniqueId();
        await connection('ongs').insert({
            id,
            name,
            email,
            whatsapp: brazilCode + whatsapp,
            city,
            uf
        });
    
        return response.json({ login: id });
    },
    async read(request, response) {
        const ongs = await connection('ongs').select('*');
    
        return response.json(ongs);
    }
};

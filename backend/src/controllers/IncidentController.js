const connection = require('../database/connection');

const PAGINATION_SIZE = 5;

module.exports = {
    async create(request, response) {
        const { title, description, value } = request.body;
        const ong_id = request.headers.authorization;

        const [ id ] = await connection('incidents').insert({
            title,
            description,
            value,
            ong_id
        });
    
        return response.json({ id });
    },
    async read(request, response) {
        const { page = 1 } = request.query;

        const [ count ] = await connection('incidents').count();

        const incidents = await connection('incidents')
            .innerJoin('ongs', 'ongs.id', 'incidents.ong_id')
            .limit(PAGINATION_SIZE)
            .offset((page-1) * PAGINATION_SIZE)
            .select([
                'incidents.*',
                'ongs.name',
                'ongs.email',
                'ongs.whatsapp',
                'ongs.city',
                'ongs.uf'
            ]);

        const totalPages = Math.ceil(count['count(*)'] / PAGINATION_SIZE);
        response.header('X-Total-Pages', totalPages);
    
        return response.json(incidents);
    },
    async delete(request, response) {
        const { id } = request.params;
        const ong_id = request.headers.authorization;

        const incident = await connection('incidents')
            .where({ id })
            .select('ong_id')
            .first();

        if (incident.ong_id != ong_id) {
            return response.status(401).json({ error: 'Operation not permitted.' });
        }
        
        await connection('incidents').where({ id }).delete();
    
        return response.status(204).send();
    }
};

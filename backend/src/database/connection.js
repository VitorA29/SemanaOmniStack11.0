const knex = require('knex');
const configuration = require('../../knexfile');

const env = process.env.NODE_ENV;
let connection;
switch(env) {
    case 'dev':
        connection = knex(configuration.development);
        break;
    case 'test':
        connection = knex(configuration.test);
        break;
    default:
        throw `Invalid node environment: '${env}'`;
}

module.exports = connection;

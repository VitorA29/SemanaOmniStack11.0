const express = require('express');
const { celebrate, Segments, Joi } = require('celebrate');
const jwt = require('./jwt');

const OngController = require('./controllers/OngController');
const IncidentController = require('./controllers/IncidentController');
const ProfileController = require('./controllers/ProfileController');
const SessionController = require('./controllers/SessionController');

const routes = express.Router();

const authorizationMiddleware = async (req, res, next) => {
    const [ , token ] = req.headers.authorization.split(' ')
    
    let auth;
    try {
        const payload = await jwt.verify(token);
    }
    catch (err) {
        console.error(err);
        return res.status(401).send(err);
    }

    // transmite the auth element, eq a Ong.
    auth = true;
    req.auth = auth;

    next();
};

routes.get('/sessions', SessionController.login);
routes.post('/sessions', SessionController.create);

routes.get('/ongs', OngController.read);
routes.post('/ongs', celebrate({
    [ Segments.BODY ]: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        whatsapp: Joi.string().required().min(10).max(11),
        city: Joi.string().required(),
        uf: Joi.string().required().length(2)
    })
}), OngController.create);

routes.get('/profile', celebrate({
    [ Segments.HEADERS ]: Joi.object({
        authorization: Joi.string().required()
    }).unknown()
}), ProfileController.read);

routes.get('/incidents', celebrate({
    [ Segments.QUERY ]: Joi.object().keys({
        page: Joi.number()
    })
}), IncidentController.read);
routes.post(
    '/incidents',
    celebrate({
        [ Segments.HEADERS ]: Joi.object({
            authorization: Joi.string().required()
        }).unknown()
    }),
    celebrate({
        [ Segments.BODY ]: Joi.object().keys({
            title: Joi.string().required(),
            description: Joi.string().required(),
            value: Joi.number().required()
        })
    }),
    IncidentController.create
);
routes.delete('/incidents/:id', celebrate({
    [ Segments.PARAMS ]: Joi.object().keys({
        id: Joi.number().required()
    })
}), IncidentController.delete);

routes.get('/me', authorizationMiddleware, (req, res) => {
    res.send(req.auth);
});

module.exports = routes;

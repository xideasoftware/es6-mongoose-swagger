import Joi                  from 'joi';
import request              from 'request';
import { waterfall }        from 'async';
import { without, omit }    from 'lodash';
import { Router }           from 'express';

import { user }             from '../../../module-schemas';
import { validateRequest }  from '../../../module-middlewares';
import { issueToken }       from '../../../module-jwt';





const router        = new Router();
const {User, types} = user;
const allowedTypes  = without(types, 'ADMIN');
const fieldsToOmit  = [
	'password',
	'facebook',
	'google'
];





const schema = {
	type: Joi.string().valid(allowedTypes).required(),
	accessToken: Joi.string().required()
};





const authorizeFacebook = (req, res, next) => {
	const {type, accessToken} = req.body;

	const tasks = [
		(cb) => {
			const options = {
				uri: 'https://graph.facebook.com/v2.8/me',
				json: true,
				qs: {
					access_token: accessToken,
					fields: 'first_name,last_name,email'
				}
			};

			request(options, (err, response, body) => {
				if(err) return cb(err);

				let doc = {
					type,
					facebook: {
						accessToken,
						userId: body.id
					}
				};

				if(body.first_name) doc.firstName = body.first_name;
				if(body.last_name) doc.lastName = body.last_name;
				if(body.email) doc.email = body.email;

				cb(null, doc);
			});
		},

		//Check if user is already registered with us via facebook
		(doc, cb) => {
			const query = {'facebook.userId': doc.facebook.userId};

			User.findOne(query, (err, result) => {
				if(err) return cb(err);
				cb(null, doc, result);
			});
		},

		//If user isn't already registered create her account
		(doc, result, cb) => {
			if(result) return cb(null, result);

			User.create(doc, (err, result) => {
				if(err) return cb(err);
				cb(null, result);
			});
		},

		(result, cb) => {
			result              = result.toObject();
			const {_id, type}   = result;
			const payload       = {_id, type};

			issueToken(payload, (err, token) => {
				if(err) return cb(err);
				cb(null, result, token);
			});
		}
	];

	waterfall(tasks, (err, result, token) => {
		if(err) return next(err);

		const userDetails   = omit(result, fieldsToOmit);
		const responseBody  = {user: userDetails, token};

		res.set('x-user-type', result.type);
		res.status(201).send(responseBody);
	});
};





router.post('/v1/user/authorize/facebook', validateRequest(schema), authorizeFacebook);





export default router;

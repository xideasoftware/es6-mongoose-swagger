import '../../../test/bootstrap';

import should   from 'should';
import request  from 'supertest';
import {omit}   from 'lodash';
import app      from '../../../app';





describe("[GET] /v1/users/:userId", () => {
	this.timeout(20000);

	let user            = null;
	let userId          = null;
	let authToken       = null;
	const fieldsToOmit  = [
		'password',
		'facebook',
		'google'
	];





	beforeEach(() => {
		user        = global.user;
		userId      = user._id;
		authToken   = global.authToken;
	});





	it('Should get user detail', (done) => {
		request(app)
			.get(`/v1/users/${userId}`)
			.set('x-access-token', authToken)
			.expect(200)
			.expect(({body}) => {
				const expected = omit(user, fieldsToOmit);
				should.deepEqual(body, expected);
			})
			.end(done);
	});
});
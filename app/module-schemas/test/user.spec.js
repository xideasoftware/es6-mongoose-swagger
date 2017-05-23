import '../../test/bootstrap';

import should from 'should';
import Chance from 'chance';
import {user} from '../lib';

const random = new Chance();
const {User, statuses, types} = user;

describe('user', function() {
    this.timeout(20000);

    var doc = null;
    var userId = null;

    beforeEach(() => {
        doc = {
            firstName: random.first(),
            lastName: random.last(),
            email: random.email(),
            password: random.hash(),
            status: random.pickone(statuses),
            type: random.pickone(types),
            dateCreated: random.date()
        }
    });

    afterEach((done) => {
        if(!userId) return done();
        User.findByIdAndRemove(userId, done);
    });

    function shouldComplain(doc, key, done) {
        User.create(doc, (err) => {
            should.exist(err);
            should.exist(err.errors[key]);
            done()
        })
    }

    function shouldNotComplain(doc, done) {
        User.create(doc, (err, result) => {
            should.not.exist(err);
            should.exist(result);
            userId = result._id;
            done();
        });
    }

    it('Should successfully save a user', (done) => {
        User.create(doc, (err, result) => {
            if(err) return done(err);

            result = result.toObject();
            doc.dateCreated = result.dateCreated;
            doc._id = result._id;
            userId = result._id;

            should.deepEqual(result, doc);
            done();
        });
    });

    it('Should not complain if firstName is not provided', (done) => {
        delete doc.firstName;
        shouldNotComplain(doc, done);
    });

    it('Should not complain if firstName is not provided', (done) => {
        delete doc.lastName;
        shouldNotComplain(doc, done);
    });

    it('Should not complain if password is not provided', (done) => {
        delete doc.password;
        shouldNotComplain(doc, done);
    });

    it('Should not complain if email is not provided', (done) => {
        delete doc.email;
        shouldNotComplain(doc, done);
    });

    it('Should complain if type is not provided', (done) => {
        delete doc.type;
        shouldComplain(doc, 'type', done);
    });

    it('Should complain if email is invalid', (done) => {
        doc.email = random.word();
        shouldComplain(doc, 'email', done);
    });

    it('Should not complain when status is not provided', (done) => {
        delete doc.status;
        shouldNotComplain(doc, done);
    });

    it('Should not complain when dateCreated is not provided', (done) => {
        delete doc.dateCreated;
        shouldNotComplain(doc, done);
    });
});

import {waterfall}      from 'async';
import {get}            from '../module-config';
import {db, user}       from '../module-schemas';
import {generateUser}   from '../module-testhelpers';
import {issueToken}     from '../module-jwt';

const {User} = user;

before((done) => {
    this.timeout(20000);

    const tasks = [
        (cb) => {
            process.env.ENV = 'test';
            const mongodbUri = get('mongodb_uri');

            db.open(mongodbUri, cb);
        },
        (cb) => {
            let doc = generateUser();

            User.create(doc, (err, result) => {
                if(err) return cb(err);
                global.user = result.toObject();
                cb();
            });
        },
        (cb) => {
            const {_id, type} = global.user;
            issueToken({_id, type}, (err, token) => {
                if(err) return cb(err);
                global.authToken = token;
                cb();
            });
        }
    ];

    waterfall(tasks, (err) => {
        if(err) console.log(err);
        done();
    });
});

after((done) => {
    const tasks = [
        (cb) => {
            if(!global.user) return cb();
            User.findByIdAndRemove(global.user._id, cb);
        }
    ];

    waterfall(tasks, (err) => {
        if(err) console.log(err);
        db.close(done);
    });
});
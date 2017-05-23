import { createServer } from 'http';
import app from './app';
import {get} from './module-config';
import {db} from './module-schemas';
import {waterfall} from 'async';

const tasks = [
    (cb) => {
        const mongodbUri = get('mongodb_uri');

        db.open(mongodbUri, cb);
    },

    (cb) => {
        const server = createServer(app),
            port = get('port');

        server.listen(port, () => {
            console.log('Server is running at : ' + port);
            cb(null, server);
        });
    }
];

function bootstrap() {
    waterfall(tasks, (err) => {
        if(err) console.log(err);
    });
}

export default bootstrap;

import express              from 'express';
import cors                 from 'cors';
import morgan               from 'morgan';
import bodyParser           from 'body-parser';
import path                 from 'path';
import swagger              from 'swagger-node-express';

import {errorHandler}       from './module-middlewares';

import restIdentity       from './rest-identity';
import restUsers          from './rest-users';


const app = express();
const subpath = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));

restIdentity(app);
restUsers(app);

app.use(errorHandler);

app.use('/v1', subpath);
swagger.setAppHandler(app);

if (process.argv[2] === undefined) {
    app.use(express.static(path.join(__dirname, 'dist')));
} else {
    app.use(express.static(path.join(__dirname, 'assets')));
}

swagger.configureSwaggerPaths('', 'swagger', '');

swagger.setApiInfo({
    title: "User API",
    description: "",
    termsOfServiceUrl: "",
    contact: "",
    license: "",
    licenseUrl: ""
});





export default app;

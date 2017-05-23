import db from './db';
import {userSchema, userStatuses, userTypes} from './user';

const user = {
    schema: userSchema,
    statuses: userStatuses,
    types: userTypes,
    User: db.model('User', userSchema, 'users')
};

export {
    db,
    user
};
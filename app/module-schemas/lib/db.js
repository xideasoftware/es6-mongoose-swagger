import mongoose from 'mongoose';

const db = mongoose.createConnection();

db.on('open', () => {
    console.log('Connected to database.');
});

db.on('close', () => {
    console.log('Disconnected from database.');
});

export default db;
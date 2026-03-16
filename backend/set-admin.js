import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const MONGODB_URI = process.env.MONGODB_URI;

async function setAdmin() {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const result = await mongoose.connection.db.collection('users').updateOne(
        { email: ADMIN_EMAIL },
        { $set: { role: 'admin' } }
    );

    if (result.matchedCount === 0) {
        console.log(`ERROR: No user found with email ${ADMIN_EMAIL}. Make sure you have logged in at least once.`);
    } else {
        console.log(`SUCCESS: User ${ADMIN_EMAIL} has been updated to role=admin!`);
    }

    await mongoose.disconnect();
    process.exit(0);
}

setAdmin().catch(err => {
    console.error(err);
    process.exit(1);
});

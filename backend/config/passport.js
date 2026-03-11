import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js'; // Ensure path and .js extension are correct

export default function (passport) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                // The URL Google redirects to after login
                callbackURL: process.env.CALLBACK_URL || "http://localhost:5000/auth/google/callback",
            },
            async (accessToken, refreshToken, profile, done) => {
                // This object matches what your MongoDB User model expects
                const newUser = {
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    image: profile.photos[0].value,
                };

                try {
                    // Check if user already exists in our database
                    let user = await User.findOne({ googleId: profile.id });

                    if (user) {
                        // User exists, pass them to the next step
                        return done(null, user);
                    } else {
                        // New user, save them to the database
                        user = await User.create(newUser);
                        return done(null, user);
                    }
                } catch (err) {
                    console.error("Error during Google Strategy strategy:", err);
                    return done(err, null);
                }
            }
        )
    );

    // Serializing: Decides which bit of data to save in the session (the user ID)
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // Deserializing: Uses the ID from the session to find the full user in MongoDB
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
}
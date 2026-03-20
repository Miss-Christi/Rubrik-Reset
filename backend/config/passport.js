import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js'; // Ensure path and .js extension are correct

export default function (passport) {

    const callbackURL = process.env.NODE_ENV === "production"
        ? process.env.PROD_CALLBACK_URL
        : process.env.DEV_CALLBACK_URL;

    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                // The URL Google redirects to after login
                callbackURL: callbackURL,
            },
            async (accessToken, refreshToken, profile, done) => {
                const email = profile.emails[0].value;

                // Check for official email domain if configured
                const officialDomain = process.env.OFFICIAL_EMAIL_DOMAIN;
                if (officialDomain && !email.endsWith(`@${officialDomain}`)) {
                    return done(null, false, { message: "This email does not exist as an official user." });
                }

                const newUser = {
                    googleId: profile.id,
                    name: profile.displayName,
                    email: email,
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
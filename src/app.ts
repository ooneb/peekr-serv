import * as dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import session from 'express-session';
import passport from 'passport';

import CONFIG from './config';
import { UserRoutes } from './routes/user_routes';
import { TumblrService } from './services/TumblrService';

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(
  session({
    secret: CONFIG.session_secret,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
// app.use(passport.session());
app.use(express.urlencoded({ extended: true }));

TumblrService.initAuth();

// app.use('/users', UserRoutes);

app.get('/', async (req: Request, res: Response) => {
  res.json('kikoolol');
});

app.get('/tumblr/auth', passport.authenticate('tumblr', { session: false }));

app.get(
  '/tumblr/oauth_cb',
  passport.authenticate('tumblr', { failureRedirect: '/' }),
  (req: Request, res: Response) => {
    console.log('oauth_cb success');
    res.json(req.user);
  }
);

app.use((req: Request, res: Response) => res.status(404).json({ message: 'nothing here' })); // Catch unhandled routes

app.use((err: Error, req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

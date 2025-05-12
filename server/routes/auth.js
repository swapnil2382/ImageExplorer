const router = require('express').Router();
const passport = require('passport');

const CLIENT_HOME_URL = process.env.CLIENT_HOME_URL || "http://localhost:3000";

router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${CLIENT_HOME_URL}/login/failed`,
    session: true
  }),
  (req, res) => {
    res.redirect(CLIENT_HOME_URL);
  }
);

router.get('/logout', (req, res) => {
  req.logout(() => {
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Logged out' });
  });
});

router.get('/user', (req, res) => {
  res.send(req.user || null);
});

module.exports = router;

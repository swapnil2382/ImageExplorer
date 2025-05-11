const router = require('express').Router();
const passport = require('passport');

router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

router.get('/google/callback',
  passport.authenticate('google', {
    successRedirect: 'http://localhost:3000',
    failureRedirect: '/login/failed'
  })
);

router.get('/logout', (req, res) => {
  req.logout(() => {
    res.clearCookie('connect.sid'); // clear the session cookie
    res.status(200).json({ message: 'Logged out' });
  });
});


router.get('/user', (req, res) => {
  res.send(req.user || null);
});

module.exports = router;

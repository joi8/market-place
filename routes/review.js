const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const isAuth = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }
    next();
}

router.post('/services/:id/reviews', isAuth, reviewController.postReview);

module.exports = router;
const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

// Middleware to check if user is authenticated
const isAuth = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }
    next();
}

router.get('/services', serviceController.getServices);
router.get('/services/new', isAuth, serviceController.getNewService);
router.post('/services', isAuth, serviceController.postNewService);
router.get('/services/:id', serviceController.getService);
router.get('/services/:id/edit', isAuth, serviceController.getEditService);
router.post('/services/:id/edit', isAuth, serviceController.postEditService);
router.post('/services/:id/delete', isAuth, serviceController.postDeleteService);

module.exports = router;
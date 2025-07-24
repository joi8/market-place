const Review = require('../models/review');
const Service = require('../models/service');

exports.postReview = async (req, res) => {
    const serviceId = req.params.id;
    const { rating, comment } = req.body;
    const review = new Review({
        rating,
        comment,
        user: req.session.user._id,
        service: serviceId
    });
    await review.save();

    const service = await Service.findById(serviceId);
    service.reviews.push(review);
    await service.save();

    res.redirect(`/services/${serviceId}`);
};
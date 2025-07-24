const Service = require('../models/service');

exports.getServices = async (req, res) => {
    const { search } = req.query;
    let services;
    if (search) {
        services = await Service.find({
            $text: { $search: search }
        }).populate('provider', 'name');
    } else {
        services = await Service.find().populate('provider', 'name');
    }
    res.render('services/index', { services });
};

exports.getService = async (req, res) => {
    const service = await Service.findById(req.params.id)
        .populate('provider', 'name')
        .populate({
            path: 'reviews',
            populate: {
                path: 'user',
                model: 'User'
            }
        });
    res.render('services/show', { service });
};

exports.getNewService = (req, res) => {
    res.render('services/new');
};

exports.postNewService = async (req, res) => {
    const { title, description } = req.body;
    const service = new Service({
        title,
        description,
        provider: req.session.user._id
    });
    await service.save();
    res.redirect('/services');
};

exports.getEditService = async (req, res) => {
    const service = await Service.findById(req.params.id);
    if (service.provider.toString() !== req.session.user._id.toString()) {
        return res.redirect('/');
    }
    res.render('services/edit', { service });
};

exports.postEditService = async (req, res) => {
    const { title, description } = req.body;
    const service = await Service.findById(req.params.id);
    if (service.provider.toString() !== req.session.user._id.toString()) {
        return res.redirect('/');
    }
    await Service.findByIdAndUpdate(req.params.id, { title, description });
    res.redirect(`/services/${req.params.id}`);
};

exports.postDeleteService = async (req, res) => {
    const service = await Service.findById(req.params.id);
    if (service.provider.toString() !== req.session.user._id.toString()) {
        return res.redirect('/');
    }
    await Service.findByIdAndDelete(req.params.id);
    res.redirect('/services');
};
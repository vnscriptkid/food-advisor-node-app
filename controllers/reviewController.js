const Review = require('mongoose').model('Review');

exports.addReview = async (req, res) => {
    req.body.author = req.user.id;
    req.body.store = req.params.id;

    const newReview = new Review(req.body);
    await newReview.save();

    req.flash('success', 'Review saved!');
    res.redirect('back');
}
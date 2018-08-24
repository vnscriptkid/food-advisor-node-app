const mongoose = require('mongoose');
const slugs = require('slugs');
mongoose.Promise = global.Promise;

const storeSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Please enter a store name!'
    },
    slug: String,
    description: {
        type: String,
        trim: true
    },
    tags: [ String ],
    created: {
        type: Date,
        default: Date.now
    },
    location: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: 
            [{
                type: Number,
                required: 'You must supply coordinates!'
            }],
        address: {
            type: String,
            required: 'You must supply an address!'
        }        
    },
    photo: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: 'You must supply an author'
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Define our indexes
storeSchema.index({
    name: 'text',
    description: 'text'
})

storeSchema.pre('save', async function(next) {
    if (!this.isModified('name')) {
        console.log('isModified === false!');
        return next();
    }
    this.slug = slugs(this.name);
    const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
    const foundStores = await this.constructor.find({ slug: slugRegEx });
    console.log('foundStores: ', foundStores);
    if (foundStores.length) {
        this.slug = `${this.slug}-${foundStores.length + 1}`;
    }
    next();
})

storeSchema.statics.getTagsList = function() {
    return this.aggregate([
        { $unwind: '$tags' },
        { $group: { _id: '$tags', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]);
}

storeSchema.statics.getTopStores = function() {
    return this.aggregate([
        { $lookup: {
            from: 'reviews',
            localField: '_id',
            foreignField: 'store',
            as: 'reviews'
        } },
        { $match: { 'reviews.0': { $exists: true } } },
        { $project: {
            photo: '$$ROOT.photo',
            name: '$$ROOT.name',
            reviews: '$$ROOT.reviews',
            slug: '$$ROOT.slug',
            averageRating: { $avg: '$reviews.rating' }
        } },
        { $sort: { averageRating: -1 } },
        { $limit: 10 }
    ])
}

storeSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'store'
})

module.exports = mongoose.model('Store', storeSchema);
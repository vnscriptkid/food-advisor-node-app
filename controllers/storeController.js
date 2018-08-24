const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const User = mongoose.model('User');
const multer = require('multer');
const Jimp = require('jimp');
const uuidv4 = require('uuid/v4');

const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter: (req, file, next) => {
        const isPhoto = file.mimetype.startsWith('image/');
        if (isPhoto) {
            return next(null, true);
        } else {
            next({ message: 'That fileType is not allowed!' }, false);
        }
    }
}

exports.homePage = (req, res) => {
    res.render('hello', { title: 'hello' })
}

exports.addStore = (req, res) => {
    res.render('editStore', { title: 'Add Store' })
}

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
    if (!req.file) return next();
    const photo = await Jimp.read(req.file.buffer);
    const extension = req.file.mimetype.split('/')[1];
    req.body.photo = `${uuidv4()}.${extension}`;
    await photo.resize(800, Jimp.AUTO);
    await photo.write(`./public/uploads/${req.body.photo}`);
    next();
}

exports.createStore = async (req, res) => {
    req.body.author = req.user._id
    const newStore = new Store(req.body);
    await newStore.save();
    req.flash('success', `Successfully created ${newStore.name}`);
    res.redirect('/');
}

exports.getStores = async (req, res) => {
    const page = parseInt(req.params.page) || 1;
    const limit = 2;

    const skip = page * limit - limit;

    const storesPromise = Store
        .find()
        .skip(skip)
        .limit(limit)
        .sort({ created: 'desc' });

    const countPromise = Store.countDocuments();

    const [ stores, count ] = await Promise.all([ storesPromise, countPromise ]);

    const pages = Math.ceil(count / limit);

    if (page > pages) {
        req.flash('info', `You asked for page ${page}. But that doesn't exist. So I put you on page ${pages}`)
        res.redirect(`/stores/page/${pages}`);
        return;
    }

    res.render('getStores', { title: 'Stores', stores, count, pages, page  });
}

const confirmOwner = (store, user) => {
    if (!store.author.equals(user._id)) {
        throw Error('You are not the owner of the store!');
    }
}

exports.editStore = async (req, res) => {
    // 1. find store with given id
    const foundStore = await Store.findById(req.params.id);

    if (!foundStore) {
        req.flash('error', 'Store not found!');
        return res.redirect('/stores');
    }

    // 2. check owner of the store
    confirmOwner(foundStore, req.user);

    // 3. render the edit form
    res.render('editStore', { title: 'Edit Store', store: foundStore })
}

exports.updateStore = async (req, res) => {
    const updatedStore = await Store.findByIdAndUpdate(req.params.id, req.body, {
        runValidators: true,
        new: true
    })
    req.flash('success', 'Updated successfully');
    res.redirect(`/stores/${updatedStore.id}/edit`)
}

exports.getStoreBySlug = async (req, res) => {
    const foundStore = await Store.findOne({ slug: req.params.slug }).populate('author reviews');
    if (!foundStore) return next();
    res.render('store', { store: foundStore, title: foundStore.name });
}

exports.getStoresByTag = async (req, res) => {
    const tag = req.params.tag;
    const tagQuery = tag ? { tags: tag } : {};
    const tagsPromise = Store.getTagsList();
    const storesPromise = Store.find(tagQuery);
    const [tags, stores] = await Promise.all([ tagsPromise, storesPromise ]);
    res.render('tag', { tags, title: 'Tags', tag, stores });
}

exports.searchStores = async (req, res) => {
    const stores = await Store
    .find({
        $text: { $search: req.query.q }
    }, {
        score: { $meta: 'textScore' }
    })
    .sort({
        score: { $meta: 'textScore' }
    })
    .limit(5)

    res.json(stores);
}

exports.heartStore = async (req, res) => {
    // TODO: check if the id not valid one
    const hearts = req.user.hearts.map(obj => obj.toString());
    const operator = hearts.includes(req.params.id) ? '$pull' : '$addToSet';

    const user = await User.findOneAndUpdate(req.user._id, 
        { [operator]: { hearts: req.params.id } },
        { new: true }
    )

    res.send(user.hearts);
}

exports.getHearted = async (req, res) => {
    const stores = await Store.find({
        _id: { $in: req.user.hearts }
    });
    res.render('getStores', { title: 'Hearted Stores', stores })
}

exports.getTopStores = async (req, res) => {
    const stores = await Store.getTopStores();
    res.render('topStores', { stores, title: 'Top Stores' })
    // res.json(stores);
}


const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', storeController.homePage);

router.get('/stores', catchErrors(storeController.getStores));
router.get('/stores/page/:page', catchErrors(storeController.getStores));

router.get('/stores/:id/edit',
    authController.isLoggedIn,
    catchErrors(storeController.editStore)
);

router.get('/add', authController.isLoggedIn, storeController.addStore);

router.post('/add',
    authController.isLoggedIn,
    storeController.upload,
    catchErrors(storeController.resize),
    catchErrors(storeController.createStore)
);

router.post('/add/:id',
    authController.isLoggedIn,
    storeController.upload,
    catchErrors(storeController.resize),
    catchErrors(storeController.updateStore)
);

router.get('/store/:slug', catchErrors(storeController.getStoreBySlug));

router.get('/tags', catchErrors(storeController.getStoresByTag));

router.get('/tags/:tag', catchErrors(storeController.getStoresByTag));

router.get('/login', userController.loginForm);

router.post('/login', authController.login);

router.get('/register', userController.registerForm);

// 3 steps
// 1. validate
// 2. create new user
// 3. login
router.post('/register', 
    userController.validateRegister,
    userController.register,
    authController.login
);

router.get('/logout', authController.logout);

router.get('/account', authController.isLoggedIn, authController.account);

router.post('/account', authController.isLoggedIn, catchErrors(authController.updateAccount));

router.post('/account/forgot', catchErrors(authController.forgot))

router.get('/account/reset/:token', catchErrors(authController.reset));

router.post('/account/reset/:token', authController.confirmedPasswords, catchErrors(authController.update));

// API

router.get('/api/search', storeController.searchStores);

router.post('/api/stores/:id/heart', catchErrors(storeController.heartStore));

// hearted Stores

router.get('/hearts', authController.isLoggedIn , catchErrors(storeController.getHearted));

// reviews

router.post('/reviews/:id', authController.isLoggedIn, catchErrors(reviewController.addReview));

router.get('/top', catchErrors(storeController.getTopStores))

module.exports = router;
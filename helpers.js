exports.siteName = 'vnscriptkid';

exports.staticMap = ([ long, lat ]) => `https://maps.googleapis.com/maps/api/staticmap?center=${lat}, ${long}&zoom=15&size=400x400&markers=${lat}, ${long}&key=${process.env.GOOGLE_MAP_KEY}`;

exports.moment = require('moment');
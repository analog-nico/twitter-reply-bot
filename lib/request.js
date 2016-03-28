'use strict';

var request = require('request-promise');
var _ = require('lodash');

var credentials = require('../settings.json').twitter_api;


function getRequestOptions(options, includeUserToken) {

    _.assign(options, {
        oauth: {
            consumer_key: credentials.consumer_key,
            consumer_secret: credentials.consumer_secret
        },
        headers: {
            'Accept': '*/*',
            'Connection': 'close',
            'User-Agent': 'node.js'
        },
        json: true
    });

    if (includeUserToken) {
        _.assign(options.oauth, {
            token: credentials.access_token_key,
            token_secret: credentials.access_token_secret
        });
    }

    return options;

}


module.exports = function (options, includeUserToken) {

    options = getRequestOptions(options, includeUserToken);

    return request(options);

};

'use strict';

var _ = require('lodash');
var moment = require('moment');

var request = require('./request.js');
var settings = require('../settings.json');


module.exports = function (query, minAge, maxAge) {

    var timeLimitReached = false;
    var minId = null;

    function getTweets(query, chooseFromThese) {

        chooseFromThese = chooseFromThese || [];

        var options = {
            uri: 'https://api.twitter.com/1.1/search/tweets.json',
            qs: {
                q: query,
                lang: settings.bot_parameters.lang,
                count: 100
            }
        };

        if (minId !== null) {
            options.qs.max_id = minId;
        }

        return request(options)
            .then(function (response) {

                if (response.errors) {
                    console.dir(response.errors);
                    throw new Error();
                }

                if (response.statuses.length === 0) {
                    timeLimitReached = true;
                }

                _.forEach(response.statuses, function (status) {

                    if (minId === null || minId > status.id) {
                        minId = status.id;
                    }

                    var createdAt = moment(status.created_at.substr(4), 'MMM D HH:mm:ss Z YYYY');
                    var minutesAgo = moment().diff(createdAt, 'minutes');

                    if (minutesAgo > maxAge) {
                        timeLimitReached = true;
                    }

                    if (minutesAgo < minAge || minutesAgo > maxAge) {
                        return;
                    }

                    if (status.text.match(/^RT @/) !== null || status.text.match(/^@/) !== null) {
                        return;
                    }

                    console.log(status.id + ' ' + status.text);

                    chooseFromThese.push(status);

                });

            })
            .delay(2000)
            .then(function () {

                if (timeLimitReached === false) {
                    return getTweets(query, chooseFromThese);
                } else {
                    return chooseFromThese;
                }

            });

    }

    return getTweets(query);

};

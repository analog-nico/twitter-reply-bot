'use strict';

var _ = require('lodash');
var moment = require('moment');
var BPromise = require('bluebird');

var search = require('./lib/search.js');
var users = require('./lib/users.js');
var responses = require('./lib/responses.js');
var reply = require('./lib/reply.js');


var settings = require('./settings.json');


function tweet() {

    return search(settings.bot_parameters.query, settings.bot_parameters.replyToTweetsAtLeastXMinutesOld, settings.bot_parameters.replyToTweetsAtLeastXMinutesOld + settings.bot_parameters.replyOnceEveryXMinutes - 1)
        .then(function (chooseFromThese) {

            var chooseFromThese = _.shuffle(chooseFromThese);

            function checkUsername(index) {

                if (index >= chooseFromThese.length) {
                    return null;
                }

                return users.userAlreadyContacted(chooseFromThese[index].user.screen_name)
                    .then(function (contacted) {

                        if (contacted === false) {
                            return chooseFromThese[index];
                        }

                        console.log('Skipping ' + chooseFromThese[index].user.screen_name);
                        return checkUsername(index+1);

                    });

            }

            return checkUsername(0);

        })
        .then(function (chosenTweet) {

            console.dir(chosenTweet);

            if (chosenTweet === null) {
                return null;
            }

            return users.storeUserAsContacted(chosenTweet.user.screen_name) // TODO: Use user id instead so that even renamed accounts don't get contacted again.
                .then(function () {
                    return chosenTweet;
                });

        })
        .then(function (chosenTweet) {

            if (chosenTweet === null) {
                return null;
            }

            var compiledTweet = responses.getNextTweet(chosenTweet.id_str, chosenTweet.user.screen_name);
            console.dir(compiledTweet);

            return reply(compiledTweet);

        })
        .finally(function () {
            console.log('Next run: ' + moment().add(settings.bot_parameters.replyOnceEveryXMinutes, 'minutes').format());
            setTimeout(tweet, 1000*60*settings.bot_parameters.replyOnceEveryXMinutes);
        });

}

BPromise.resolve()
    .then(users.init)
    .then(function () {
        return users.storeUserAsContacted('TheHugFairy');
    })
    .then(function () {

        // Tests
        return BPromise.resolve()
            .then(function () {
                return users.userAlreadyContacted('TheHugFairy');
            })
            .then(function (contacted) {
                if (contacted !== true) {
                    throw new Error('@TheHugFairy should be marked as contacted');
                }
            })
            .then(function () {
                return users.userAlreadyContacted('Cannot-exist-because-dashes');
            })
            .then(function (contacted) {
                if (contacted !== false) {
                    throw new Error('@Cannot-exist-because-dashes should NOT be marked as contacted');
                }
            });

    })
    .then(tweet)
    .catch(function (err) {
        if (_.isArray(err)) {
            _.forEach(err, function (e) {
                console.dir(e);
            });
        } else {
            console.dir(err);
        }
        console.log('EXITING');
        process.exit(1);
    });


// Quick fix because OpenShift is expecting a web server
var express = require('express');
var app = express();

app.get('/', function (req, res) {
    res.send('The Twitter Reply Bot at your service!');
});

var server = app.listen(
    process.env.OPENSHIFT_NODEJS_PORT || 3000,
    process.env.OPENSHIFT_NODEJS_IP ? process.env.OPENSHIFT_NODEJS_IP : '127.0.0.1',
    function () {
        var host = server.address().address;
        var port = server.address().port;

        console.log('Express app listening at http://%s:%s', host, port);
    }
);

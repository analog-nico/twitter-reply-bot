'use strict';

var BPromise = require('bluebird');
var Twitter = require('twitter');

var client = new Twitter(require('../settings.json').twitter_api);

module.exports = function (compiledTweet) {

    return new BPromise(function (resolve, reject) {

        var data = require('fs').readFileSync(compiledTweet.image);

        client.post('media/upload', { media: data }, function (err, media, response) {

            if (err) {
                reject(err);
                return;
            }

            console.dir(media);

            if (!media || !media.media_id_string) {
                reject(new Error('Image upload failed.'));
                return;
            }

            var status = {
                in_reply_to_status_id: compiledTweet.replyTo,
                status: compiledTweet.text,
                media_ids: media.media_id_string
            };

            client.post('statuses/update', status, function (err, tweet, response){

                if (err) {
                    reject(err);
                } else {
                    console.dir(tweet);
                    resolve(tweet);
                }

            });

        });

    });

};

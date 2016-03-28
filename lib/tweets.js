'use strict';

var tweetList = require('../tweets/list.json');
var path = require('path');


function compileTweet(replyTo, username, tweetInfo) {

    var parameters = ['user'];
    var parameterValues = ['@'+username];
    var code = 'return "' + tweetInfo.text.replace(/\[/g, '" + (').replace(/\]/g, ') + "') + '";';

    return {
        replyTo: replyTo,
        text: Function(parameters, code).apply(undefined, parameterValues),
        image: path.join(__dirname, '../tweets/' + tweetInfo.image)
    };

}


var indexTweet = -1;

module.exports = {
    getNextTweet: function (replyTo, username) {

        indexTweet += 1;
        if (indexTweet >= tweetList.length) {
            indexTweet = 0;
        }

        return compileTweet(replyTo, username, tweetList[indexTweet]);

    }
};

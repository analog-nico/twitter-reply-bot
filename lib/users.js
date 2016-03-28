'use strict';

var mongodb = require('mongodb');
var BPromise = require('bluebird');

var settings = require('../settings.json');


var collUsers = null;

function connectToDB() {

    return new BPromise(function (resolve, reject) {

        // http://mongodb.github.io/node-mongodb-native/driver-articles/mongoclient.html

        mongodb.MongoClient.connect(settings.database.url, function (err, db) {
            if (err) {
                reject(err);
            } else {
                resolve(db);
            }
        });

    });

}

function getUsersCollection(db) {

    return new BPromise(function (resolve, reject) {

        db.createCollection(settings.database.collection, function(err, collection) {
            if (err) {
                reject(err);
            } else {
                collUsers = collection;
                resolve(collection);
            }
        });

    });

}

module.exports = {
    init: function () {

        return BPromise.resolve()
            .then(connectToDB)
            .then(getUsersCollection);

    },
    userAlreadyContacted: function (username) {

        return new BPromise(function (resolve, reject) {

            collUsers.findOne({ u: username }, function (err, doc) {
                if (err) {
                    reject(err);
                } else {
                    resolve(doc ? true : false);
                }
            });

        });

    },
    storeUserAsContacted: function (username) {

        return new BPromise(function (resolve, reject) {

            collUsers.update(
                { u: username },
                { u: username },
                { upsert: true },
                function (err, doc) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(doc);
                    }
                }
            );

        });

    }
};

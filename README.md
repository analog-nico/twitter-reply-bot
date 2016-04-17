# Twitter Reply Bot

A Twitter bot which finds tweets that match your search terms and replies with responses you prepared. Useful for engaging with new people on a certain topic. **But [don't spam](#dont-spam)!**

## Custom Set Up

We start with the non-technical configuration and finish with the technical set up. If you are not a developer just work on the first steps and give the rest to a developer.

### 1. Define the search terms for tweets the bot shall reply to

The bot searches for tweets like you would do. There is no magic going on. What you need to do is to go to [Twitter](https://twitter.com) and enter something into the search box. E.g. enter ["starwars"](https://twitter.com/search?f=tweets&vertical=news&q=starwars&src=typd), hit enter, and then make sure you select the "Live" tab. Per default, the Twitter website selects the "Top" tab, which is only a selection of all tweets. The "Live" tab shows all matching tweets which is what the bot sees, too.

Look through the search results and make sure that there appears no tweet to which the bot shall not reply to. **This is the tricky part.** The bot is dumb. So that it doesn't make anything stupid you have to come up with search terms that only find tweets you are comfortable with replying to. For that reason the [advanced search](https://twitter.com/search-advanced) will be very useful.

If your search terms find a lot of tweets don't worry. At a later step you will be able to tell the bot how soon it is allowed to send another reply after it just sent one. If the search terms find more tweets than the bot is allowed to reply to, it will select one randomly and ignore the rest.

### 2. Prepare the responses

Each reply will consist of a text and an image. Prepare as many responses as you like. The bot will use one after the other. And if it reaches the end it will start with the first response again.

---

This concludes the non-technical part.

---

### 3. Configure the bot according to the results of the previous steps

- Clone this repository to your desktop
- In the `settings.json` set the search terms as defined in step 1 at `bot_parameters.query`. Also set `bot_parameters.lang` to filter the language. The search field on the Twitter website already shows the search terms in the format which you need to use for `bot_parameters.query`. You only need to escape `"` to `\"`. For special cases have a look at the [query operators documentation](https://dev.twitter.com/rest/public/search).
- The prepared responses go into `responses/list.json`. Since this repository contains sample data this should be self explanatory. `[user]` will be replaced with the Twitter handle to whom the reply is sent.
- In the `settings.json` change the parameter `bot_parameters.replyOnceEveryXMinutes` as needed. This ensures that a reply is sent not more than once every X minutes. This basically limits the bot from spamming to much.
- In the `settings.json` change the parameter `bot_parameters.replyToTweetsAtLeastXMinutesOld` as needed. This ensures that a reply is sent not too soon after the original tweet was sent. If a user tweets something and the bot would reply within seconds then it would be more likely that the user realizes that the response was automated and maybe reports the bot to Twitter.

### 4. Configure the Twitter credentials

In the `settings.json` fill the parameters under `twitter_api` according to the TODOs explained there.

### 5. Configure the database

To not spam a single user the bot maintains a database with Twitter users to whom it already sent a response. For that a MongoDB is required and the `database` parameters in the `settings.json` need to be filled accordingly.

### 6. Install and run

The bot runs on node.js. Install node.js v4 on your system. Then execute `npm install` in the project folder and finally execute `node server.js` to run the bot.

## Don't spam!

You have to be aware that you may violate Twitters [Developer Agreement and Policy](https://dev.twitter.com/overview/terms/agreement-and-policy), [Automation Rules](https://support.twitter.com/articles/76915-automation-rules-and-best-practices) and/or [Twitter Rules](https://support.twitter.com/articles/18311-the-twitter-rules) by using this bot - depending on how you configure it. If you don't configure it carefully [your app will get suspended](https://support.twitter.com/articles/72585) or even your account may get closed down by Twitter.

The bot already contains a few mechanisms to prevent abuse. One mechanism is the user database that makes sure that a single user never gets more that one reply from the bot. If a single user would get multiple replies she would easily think of it as spam and report the bot to Twitter. Also all responses are designed to contain an image. This image shall be used to make the reply valuable - e.g. a picture that lightens the mood. However, the bot could also be configured to sent blunt ads. Don't do this!

A rule of thumb is to prepare the responses with a nice conversation starter in mind. Not everyone will respond but with those who do you can continue the conversation in person.

## License (ISC)

In case you never heard about the [ISC license](http://en.wikipedia.org/wiki/ISC_license) it is functionally equivalent to the MIT license.

See the [LICENSE file](LICENSE) for details.

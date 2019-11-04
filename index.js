var fs = require("fs");
var util = require("util");
var twit = require("twit");
var config = require("./twitterConfig.js");

var log_file = fs.createWriteStream(__dirname + "/debug.log", { flags: "a" });
var log_stdout = process.stdout;

var T = new twit(config);

function logger(err, data, response) {
  let time = new Date();
  let apiUrl = response.request.href;
  let statusCode = response.statusCode;
  let statusMessage = response.statusMessage;
  let resp = statusCode == 200 ? data : err;

  log_file.write(
    time +
      "\n" +
      statusCode +
      " " +
      apiUrl +
      "\n" +
      statusMessage +
      "\n" +
      JSON.stringify(resp) +
      "\n" +
      "\n"
  );

  log_stdout.write(
    time +
      "\n" +
      statusCode +
      " " +
      apiUrl +
      "\n" +
      statusMessage +
      "\n" +
      JSON.stringify(resp) +
      "\n" +
      "\n"
  );
}

function getTweets() {
  var params = {
    q: "#python",
    result_type: "recent",
    lang: "en"
  };
  T.get("search/tweets", params, function(err, data, response) {
    logger(err, data, response);
    if (response.statusCode == 200) {
      data.statuses.map((ele, i) => {
        setTimeout(() => {
          reTweet(ele.id_str);
        }, i * 4 * 60000);
      });
    }
  });
}

function reTweet(tweetId) {
  T.post("statuses/retweet/:id", { id: tweetId }, function(
    err,
    data,
    response
  ) {
    logger(err, data, response);
  });
}

function init() {
  getTweets();
}
init();

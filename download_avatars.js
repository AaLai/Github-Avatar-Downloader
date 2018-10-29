var request = require('request');
var secrets = require('./secrets');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': "token " + secrets.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
    var json = JSON.parse(body);
    cb(err, json);


  });
}



// Hardcoded test
getRepoContributors("jquery", "jquery", function(err, result) {
  const list = result;
  function avatarURL (arr) {
    let avatarList = [];
    for (var num of arr) {
      avatarList.push(num.avatar_url);
    };
    return avatarList;
  }
  console.log("Errors:", err);

  console.log("Result:", avatarURL(list) );

});
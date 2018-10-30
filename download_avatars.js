// --- Bringing in required files
require('dotenv').config();
const request = require('request');
const secrets = require('./secrets');
const fs = require('fs');

// --- Bringing in user input
const args = process.argv.slice(2);

// --- Welcome message
console.log('Welcome to the GitHub Avatar Downloader!');

// --- Check that both fields are filled in user input
function repoOwnerChecker () {
  return args[0];
}

function repoNameChecker () {
  return args[1]
}

// --- If both fields aren't filled, crash the function
function arguementChecker() {
  if (!repoOwnerChecker() || !repoNameChecker()) {
    throw 'You need to enter a repoOwner and a repoName!';
  }
}

// --- Sending the HTTPS request to GitHub based on user input
function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': "token " + process.env.Git_token
    }
  };

  // --- parsing GitHub API body
  request(options, function(err, res, body) {
    var json = JSON.parse(body);
    cb(err, json);

  });
}

// --- Requests and pipes image from URL to filePath
function downloadImageByURL(url, filePath) {
const location = String(url);
request.get(location)
       .on('error', function (err) {
         throw err;
       })
       .pipe(fs.createWriteStream(filePath));
}

// --- Function checks user input, goes to entered URL and downloads all avatars to local avatar folder will give error if avatar folder doesn't exist
function GitHubAvatarDownload () {
  arguementChecker();
  const repoOwner = args[0];
  const repoName = args[1];
  getRepoContributors(repoOwner, repoName, function(err, result) {
      for (var num of result) {
        downloadImageByURL(num.avatar_url, `avatars/${num.login}.jpg`);
      }
    if (err === !null) {
      console.log("Errors:", err);
    }
    console.log("Result: Program finished");
  });
}

//-- Running
GitHubAvatarDownload();

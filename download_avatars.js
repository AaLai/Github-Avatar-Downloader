// --- Bringing in required files
const request = require('request');
const secrets = require('./secrets');
const fs = require('fs');

// --- Bringing in user input
const args = process.argv.slice(2);

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

// --- Welcome message
console.log('Welcome to the GitHub Avatar Downloader!');

// --- Sending the HTTPS request to GitHub based on user input
function getRepoContributors(repoOwner, repoName, cb) {
  if (!repoOwner || !repoName) {
    return console.log("You need to specify both a Repo Owner and Repo Name!")
  }
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': "token " + secrets.GITHUB_TOKEN
    }
  };

  // --- parsing GitHub API body
  request(options, function(err, res, body) {
    var json = JSON.parse(body);
    cb(err, json);

  });
}



// --- Function checks user input, goes to entered URL and downloads pictures in local avatar folder
function GitHubAvatarDownload () {
  arguementChecker();
  const repoOwner = args[0];
  const repoName = args[1];
  getRepoContributors(repoOwner, repoName, function(err, result) {
      for (var num of result) {
        downloadImageByURL(num.avatar_url, `avatars/${num.login}.jpg`)
      };
    if (err === !null) {
      console.log("Errors:", err);
    }
    console.log("Result: Program finished");
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

//-- Putting it all together
GitHubAvatarDownload();

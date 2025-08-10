const axios = require('axios');
const { Octokit } = require("@octokit/rest");

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const REDIRECT_URI = process.env.GITHUB_REDIRECT_URI;

// Exchange code for access token
async function getAccessToken(code) {
  const response = await axios.post(
    `https://github.com/login/oauth/access_token`,
    {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      redirect_uri: REDIRECT_URI,
    },
    { headers: { Accept: 'application/json' } }
  );
  return response.data.access_token;
}

// Get user's repos
async function getUserRepos(accessToken) {
  const octokit = new Octokit({ auth: accessToken });
  const { data } = await octokit.repos.listForAuthenticatedUser();
  return data;
}

// Get files in a repo (simplified)
async function getRepoFiles(accessToken, owner, repo) {
  const octokit = new Octokit({ auth: accessToken });
  const { data } = await octokit.repos.getContent({ owner, repo, path: '' });
  return data;
}

module.exports = { getAccessToken, getUserRepos, getRepoFiles };

const express = require('express');
const router = express.Router();
const { listRepoFiles, getFileContent, getUserRepos, getUser } = require('../controllers/githubController');

// Get authenticated user's repos
router.get('/user/repos', getUserRepos);

// Get authenticated user
router.get('/user', getUser);

// List the files/folders in a repo or a folder inside it
// GET /api/github/repos/:owner/:repo/files
router.get('/repos/:owner/:repo/files', listRepoFiles);

// Fetch the raw file content (returns base64 content)
router.get('/repos/:owner/:repo/contents/:path', getFileContent);

module.exports = router;

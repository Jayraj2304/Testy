const axios = require('axios');

exports.listRepoFiles = async (req, res) => {
  const { owner, repo } = req.params;
  const folderPath = req.query.path || "";
  const token = req.user && req.user.githubAccessToken; // customize how you get the GitHub token!

  const url = folderPath
    ? `https://api.github.com/repos/${owner}/${repo}/contents/${folderPath}`
    : `https://api.github.com/repos/${owner}/${repo}/contents`;

  try {
    const response = await axios.get(url, {
      headers: { Authorization: `token ${token}` }
    });
    // Returns an array of files and folders
    return res.json(response.data);
  } catch (err) {
    console.error("Error in githubController:", err);
    res.status(err.response?.status || 500).json({
      error: err.message,
      details: err.response?.data,
      stack: err.stack,
    });
  }
};

// For fetching actual file content
exports.getFileContent = async (req, res) => {
  const { owner, repo, path } = req.params;
  const token = req.user && req.user.githubAccessToken; // customize as needed

  // path comes from URL, may include slashes (should already be decoded)
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  try {
    const response = await axios.get(url, {
      headers: { Authorization: `token ${token}` }
    });

    if (Array.isArray(response.data)) {
      // Path is a folder, not a file!
      return res.status(400).json({ error: "Path refers to a folder, not a file." });
    }

    // Respond with only name and content (raw base64)
    return res.json({
      name: response.data.name,
      content: response.data.content, // base64, frontend should decode with atob()
    });
  } catch (err) {
    console.error("Error in githubController:", err);
    res.status(err.response?.status || 500).json({
      error: err.message,
      details: err.response?.data,
      stack: err.stack,
    });
  }
};

exports.getUserRepos = async (req, res) => {
  const token = req.user && req.user.githubAccessToken;

  try {
    const response = await axios.get('https://api.github.com/user/repos', {
      headers: { Authorization: `token ${token}` },
      params: {
        sort: 'updated',
        per_page: 100, // Adjust as needed
      },
    });
    res.json(response.data);
  } catch (err) {
    console.error("Error in githubController:", err);
    res.status(err.response?.status || 500).json({
      error: err.message,
      details: err.response?.data,
      stack: err.stack,
    });
  }
};

exports.getUser = async (req, res) => {
  const token = req.user && req.user.githubAccessToken;

  try {
    const response = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `token ${token}` },
    });
    res.json(response.data);
  } catch (err) {
    console.error("Error in githubController:", err);
    res.status(err.response?.status || 500).json({
      error: err.message,
      details: err.response?.data,
      stack: err.stack,
    });
  }
};

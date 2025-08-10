const { getAccessToken } = require('../services/githubService');

// Step 1: Redirect to GitHub login
exports.githubLogin = (req, res) => {
  const params = [
    `client_id=${process.env.GITHUB_CLIENT_ID}`,
    'scope=repo',
    `redirect_uri=${process.env.GITHUB_REDIRECT_URI}`,
  ].join('&');
  res.redirect(`https://github.com/login/oauth/authorize?${params}`);
};

// Step 2: GitHub redirects here after login
exports.githubCallback = async (req, res) => {
  try {
    const code = req.query.code;
    const token = await getAccessToken(code);
    // Store in cookie for session (for now, plain; later secure it!)
    res.cookie('github_token', token, {httpOnly: true,secure: false,sameSite: 'lax',});
    res.redirect('http://localhost:3000/dashboard'); // Or wherever
  } catch (e) {
    res.status(500).send('Authentication error');
  }
};

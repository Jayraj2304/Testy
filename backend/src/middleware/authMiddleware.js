

const authMiddleware = (req, res, next) => {
  const token = req.cookies.github_token;

  if (!token) {
    return res.status(401).json({ message: 'Authentication token not found.' });
  }

  try {
    // We are not using JWT here, the token is the github access token.
    // We will just attach the token to the request.
    // In a real app, you might want to encrypt the token in a JWT.
    req.user = {
        githubAccessToken: token
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports = authMiddleware;

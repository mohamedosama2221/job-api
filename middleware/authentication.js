const { UnauthenticatedError } = require("../errors");
const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new UnauthenticatedError(
      "sorry you are not authorized to access this page"
    );
  }

  const token = authorization.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const { userId, name } = payload;

    req.user = { userId, name };

    next();
  } catch (err) {
    throw new UnauthenticatedError("authentication failed");
  }
};

module.exports = authMiddleware;

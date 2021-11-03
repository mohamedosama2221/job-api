const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  const user = await User.create({
    ...req.body,
  });

  const token = user.createJWT();

  return res.status(StatusCodes.CREATED).json({
    success: true,
    user: {
      name: user.name,
    },
    token,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide an email and password");
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError("This email doesn't exist");
  }

  const verify = await user.checkPassword(password);

  if (!verify) {
    throw new UnauthenticatedError("Password is not correct");
  }
  const token = user.createJWT();

  return res.status(StatusCodes.OK).json({
    success: true,
    user: {
      name: user.name,
    },
    token,
  });
};

module.exports = {
  register,
  login,
};

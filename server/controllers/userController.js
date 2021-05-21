const User = require("../models/User");
const Encrypt = require("../Encrypt");

exports.whoami = (req, res) => {
  res.json(req.session.user || null);
};

//Logic to create a user
exports.createUser = async (req, res) => {
  req.body.password = Encrypt.encrypt(req.body.password);

  let user = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
  });
  console.log("New user added to database", user);
  res.send("Added successfully!");
};

//Logic to login a user
exports.loginUser = async (req, res) => {
  let email = req.body.email;
  let password = Encrypt.encrypt(req.body.password);

  let user = await User.findOne({ email, password }).exec();
  user.password = null;

  req.session.user = user;
  //If database could not find user send back error
  if (!user) {
    res.status(404).send("Wrong credentials");
  }
  //Otherwise send back the user
  res.json(user);
};

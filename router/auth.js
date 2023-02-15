/** @format */

const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const cookieParser = require("cookie-parser");
router.use(cookieParser());
require("../db/connection");
const User = require("../model/userSchema");

router.get("/", (req, res) => {
  res.send("Heloo from routrer");
});
router.get("/about", (req, res) => {
  res.send("about");
});
router.post("/contact", authenticate, async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !phone || !message) {
      console.log("error in Contact Form");
      return res.json({ error: "Plzz Fillled the contact form" });
    }
    const userContact = await User.findOne({ _id: req.userID });
    if (userContact) {
      const userMessage = await userContact.addMessage(
        name,
        email,
        phone,
        message
      );
      await userContact.save();
      res.status(201).json({ message: "user Contact successfully" });
    }
  } catch (error) {
    console.log(error);
  }
});
router.post("/webinar", authenticate, async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !phone || !message) {
      console.log("error in Contact Form");
      return res.json({ error: "Plzz Fillled the contact form" });
    }
    const userContact = await User.findOne({ _id: req.userID });
    if (userContact) {
      const userMessage = await userContact.addWebinar(
        name,
        email,
        phone,
        message
      );
      await userContact.save();
      res.status(201).json({ message: "user Contact successfully" });
    }
  } catch (error) {
    console.log(error);
  }
});
router.get("/courses", (req, res) => {
  res.send("courses");
});
//  get user data for contact page and home page
router.get("/getdata", authenticate, (req, res) => {
  // console.log("Heloo");
  res.send(req.rootUser);
});

// sigin

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Please fill the data" });
    }
    const userLogin = await User.findOne({ email: email });

    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);
      const token = await userLogin.generateAuthtoken();
      console.log(token);
      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
      });
      if (!isMatch) {
        res.status(400).json({ error: "Invalid Cradientials" });
      } else {
        res.json({ message: "user signin Successfully" });
      }
    } else {
      res.status(400).json({ error: "Invalid Cradientials" });
    }
  } catch (err) {
    console.log(err);
  }
});

// register data from mongo db
// async using
router.post("/register", async (req, res) => {
  const { name, email, phone, password, cpassword } = req.body;
  if (!name || !email || !phone || !password || !cpassword) {
    return res.status(422).json({ error: "Plz filled the field properly" });
  }
  try {
    const userExist = await User.findOne({ email: email });

    if (userExist) {
      return res.status(422).json({ error: `${email}  already Exist` });
    } else if (password != cpassword) {
      return res.status(422).json({ error: `password are not matchhing` });
    } else {
      const user = new User({ name, email, phone, password, cpassword });
      // yeha pe call function
      await user.save();

      res.status(201).json({ meassage: "user registered successfully" });
    }

    //   .catch((err) => console.log(err));
  } catch (err) {
    console.log(err);
  }
});

router.get("/profile", authenticate, (req, res) => {
  res.send(req.rootUser);
});

router.get("/chagepassword", (req, res) => {
  res.send("chagepassword");
});
router.get("/forgetpassword", (req, res) => {
  res.send("forgetpassword");
});
router.get("/resetpassword", (req, res) => {
  res.send("resetpassword");
});
module.exports = router;

//

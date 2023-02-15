/** @format */
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "Please enter your Name"],
  },
  email: {
    type: String,
    require: [true, "Please enter your Email"],
  },
  phone: {
    type: Number,

    require: [true, "Please enter your Phone Number"],
  },
  role: {
    enum: ["admin", "user"],
    type: String,
    default: "user",
  },
  bio: {
    type: String,
    required: false,
    default: "",
  },
  password: {
    type: String,
    require: [true, "Please enter your Phone password"],
    minLength: [6, "Password must be at least 6 charecter"],
  },
  cpassword: {
    type: String,
    require: [true, "Please enter your Phone confirm password"],
  },
  avatar: {
    public_id: {
      type: String,
      default: "",
    },
    url: {
      type: String,
      default: "",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  messages: [
    {
      name: {
        type: String,
        require: true,
      },
      email: {
        type: String,
        require: true,
      },
      phone: {
        type: Number,
        require: true,
      },
      message: {
        type: String,
        require: true,
      },
    },
  ],
  webinars: [
    {
      name: {
        type: String,
        require: true,
      },
      email: {
        type: String,
        require: true,
      },
      phone: {
        type: Number,
        require: true,
      },
      webinar: {
        type: String,
        require: true,
      },
    },
  ],
  tokens: [
    {
      token: {
        type: String,
        require: true,
      },
    },
  ],
  resetPasswordToken: String,
  resetPasswordEpire: String,
});

userSchema.pre("save", async function (next) {
  console.log("hi from");
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
    this.cpassword = await bcrypt.hash(this.cpassword, 12);
  }
  next();
});
// generateAuthtoken
userSchema.methods.generateAuthtoken = async function () {
  try {
    let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (err) {
    console.log(err);
  }
};
// stored the message

userSchema.methods.addMessage = async function (name, email, phone, message) {
  try {
    this.messages = this.messages.concat({ name, email, phone, message });
    await this.save();
    return this.messages;
  } catch (error) {
    console.log(error);
  }
};
userSchema.methods.addWebinar = async function (name, email, phone, webinar) {
  try {
    this.webinars = this.webinars.concat({ name, email, phone, webinar });
    await this.save();
    return this.webinars;
  } catch (error) {
    console.log(error);
  }
};
const User = mongoose.model("USER", userSchema);
module.exports = User;

import { USER } from "../models/user.js";
import { userService } from "../services/userService.js";

const createUserValid = (req, res, next) => {
  const { email, phoneNumber } = req.body;

  try {
    const existingEmail = userService.search({ email });
    const existingPhoneNumber = userService.search({ phoneNumber });

    if (existingEmail || existingPhoneNumber) {
      res.status(400);
      throw new Error(`User with the provided email or phone number already exists.`);
    }

    if (Object.keys(req.body).length !== Object.keys(USER).length - 1) {
      throw new Error("Invalid number of fields.");
    }

    for (const field in req.body) {
      if (!USER.hasOwnProperty(field)) {
        throw new Error(`Invalid field ${field}.`);
      }
      if (!req.body[field]) {
        throw new Error(`Empty field ${field}.`);
      }
    }

    validateFields(req.body);

    res.data = { ...req.body };
    next();
  } catch (err) {
    res.status(400).send(err.message);
    res.err = err;
  }
};

const updateUserValid = (req, res, next) => {
  const { id } = req.params;

  try {
    const user = userService.search({ id });

    if (!user) {
      res.status(404).send("User does not exist.");
    }

    if (!Object.keys(req.body).length) {
      throw new Error("No fields to update.");
    }

    const existingUser = userService.search({ email: req.body.email });

    if (existingUser) {
      throw new Error(`User with the provided email already exists.`);
    }

    for (const field in req.body) {
      if (!USER.hasOwnProperty(field)) {
        throw new Error(`Invalid field ${field}.`);
      }
      if (!req.body[field]) {
        throw new Error(`Empty field ${field}.`);
      }
    }

    validateFields(req.body);

    res.status(200);
    res.data = { ...req.body };
    next();
  } catch (err) {
    res.status(400).send(err.message);
    res.err = err;
  }
};

const validateFields = (body) => {
  if (body.email) {
    validateEmail(body.email);
  }
  if (body.phoneNumber) {
    validatePhone(body.phoneNumber);
  }
  if (body.firstName) {
    validateName(body.firstName);
  }
  if (body.lastName) {
    validateName(body.lastName);
  }
  if (body.password) {
    validatePassword(body.password);
  }
};

const validateEmail = (email) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    throw new Error("Invalid email");
  }
};

const validatePassword = (password) => {
  if (password.length < 3) {
    throw new Error("Password must be at least 3 characters long.");
  }
};

const validatePhone = (phone) => {
  if (!phone || !phone.match(/\+380\d{9}/g)) {
    throw new Error("Invalid phone number. Please enter the number in this format: +380xxxxxxxxx.");
  }
};

const validateName = (name) => {
  if (!name || !name.match(/^[a-zA-Z]+$/)) {
    throw new Error("Invalid first or last name.");
  }
};

export { createUserValid, updateUserValid };

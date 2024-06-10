import { Router } from "express";
import { userService } from "../services/userService.js";
import {
  createUserValid,
  updateUserValid,
} from "../middlewares/user.validation.middleware.js";
import { responseMiddleware } from "../middlewares/response.middleware.js";

const router = Router();

router.get(
  "/",
  async (req, res, next) => {
    try {
      const users = await userService.getUsers();
      res.status(200).send(users);
    } catch (err) {
      res.status(404).send({ error: true, message: err.message });
    } finally {
      next();
    }
  },
  responseMiddleware
);

router.get(
  "/:id",
  async (req, res, next) => {
    const { id } = req.params;
    try {
      const user = await userService.search({ id });
      if (!user) {
        res.status(404).send({ error: true, message: "User not found" });
      } else {
        res.status(200).send(user);
      }
    } catch (err) {
      res.status(404).send({ error: true, message: err.message });
    } finally {
      next();
    }
  },
  responseMiddleware
);

router.post(
  "/",
  createUserValid,
  async (req, res, next) => {
    const { firstName, lastName, email, phoneNumber, password } = req.body;
    try {
      const existingUserByEmail = await userService.search({ email });
      if (existingUserByEmail) {
        throw new Error('Email already exists');
      }

      const existingUserByPhoneNumber = await userService.search({ phoneNumber });
      if (existingUserByPhoneNumber) {
        throw new Error('Phone number already exists');
      }

      const newUser = await userService.createUser({
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
      });
      res.status(200).send(newUser);
    } catch (err) {
      res.status(400).send({ error: true, message: err.message });
    } finally {
      next();
    }
  },
  responseMiddleware
);

router.put(
  "/:id",
  updateUserValid,
  async (req, res, next) => {
    const { id } = req.params;
    try {
      const user = await userService.search({ id });
      if (!user) {
        res.status(404).send({ error: true, message: "User not found" });
      } else {
        const updatedUser = await userService.updateUser(id, req.body);
        res.status(200).send(updatedUser);
      }
    } catch (err) {
      res.status(400).send({ error: true, message: err.message });
    } finally {
      next();
    }
  },
  responseMiddleware
);

router.delete(
  "/:id",
  async (req, res, next) => {
    const { id } = req.params;

    try {
      const user = await userService.getOneUser({ id });
      if (!user) {
        res.status(404).send({ error: true, message: `User with id ${id} does not exist` });
      } else {
        await userService.deleteUser(id);
        res.status(200).send({ message: `User with id ${id} successfully deleted` });
      }
    } catch (err) {
      res.status(400).send({ error: true, message: err.message });
    } finally {
      next();
    }
  },
  responseMiddleware
);

export { router };

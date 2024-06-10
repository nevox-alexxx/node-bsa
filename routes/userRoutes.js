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
  (req, res, next) => {
    try {
      const users = userService.getUsers();
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
  (req, res, next) => {
    const { id } = req.params;
    try {
      const user = userService.search({ id });
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
  (req, res, next) => {
    const { firstName, lastName, email, phoneNumber, password } = req.body;
    try {
      const newUser = userService.createUser({
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
      });
      res.status(201).send(newUser);
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
  (req, res, next) => {
    const { id } = req.params;
    try {
      const user = userService.search({ id });
      if (!user) {
        res.status(404).send({ error: true, message: "User not found" });
      } else {
        const updatedUser = userService.updateUser(id, req.body);
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
  (req, res, next) => {
    const { id } = req.params;

    try {
      const user = userService.getOneUser({ id });
      if (!user) {
        res.status(404);
        res.err = new Error(`User with id ${id} does not exist`);
      } else {
        userService.deleteUser(id);
        res.data = { message: `User with id ${id} successfully deleted` };
        res.status(200);
      }
    } catch (err) {
      res.err = err;
      res.status(400);
    } finally {
      next();
    }
  },
  responseMiddleware
);

export { router };

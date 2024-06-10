import { Router } from "express";
import { fighterService } from "../services/fighterService.js";
import { responseMiddleware } from "../middlewares/response.middleware.js";
import {
  createFighterValid,
  updateFighterValid,
} from "../middlewares/fighter.validation.middleware.js";

const router = Router();

router.get(
  "/",
  async (req, res, next) => {
    try {
      res.data = await fighterService.getAllFighters();
      res.status(200);
    } catch (err) {
      res.err = err;
      res.status(404);
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
      const fighter = await fighterService.getOneFighter({ id });
      if (!fighter) {
        res.status(404);
        res.err = new Error(`Fighter with id ${id} not found`);
      } else {
        res.data = fighter;
        res.status(200);
      }
    } catch (err) {
      res.err = err;
      res.status(404);
    } finally {
      return next();
    }
  },
  responseMiddleware
);

router.post(
  "/",
  createFighterValid,
  async (req, res, next) => {
    const { name, power, defense } = req.body;

    try {
      const existingFighterByName = await fighterService.search({ name });
      if (existingFighterByName) {
        throw new Error('Fighter name already exists');
      }

      res.data = await fighterService.createFighter({
        name,
        power,
        defense,
        health: 100,
      });
      res.status(200);
    } catch (err) {
      res.err = err;
      res.status(400);
    } finally {
      next();
    }
  },
  responseMiddleware
);

router.put(
  "/:id",
  updateFighterValid,
  async (req, res, next) => {
    const { id } = req.params;

    try {
      const updatedFighter = await fighterService.updateFighter(id, req.body);
      if (!updatedFighter) {
        res.status(404);
        res.err = new Error(`Fighter with id ${id} not found`);
      } else {
        res.data = updatedFighter;
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

router.delete(
  "/:id",
  async (req, res, next) => {
    const { id } = req.params;

    try {
      const fighter = await fighterService.getOneFighter({ id });
      if (!fighter) {
        res.status(404).send({ error: true, message: `Fighter with id ${id} does not exist` });
      } else {
        await fighterService.deleteFighter(id);
        res.status(200).send({ message: `Fighter with id ${id} successfully deleted` });
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
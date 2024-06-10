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
  (req, res, next) => {
    try {
      res.data = fighterService.getAllFighters();
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
  (req, res, next) => {
    const { id } = req.params;

    try {
      const fighter = fighterService.getOneFighter({ id });
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
  (req, res, next) => {
    const { name, power, defense } = req.body;

    try {
      res.data = fighterService.createFighter({
        name,
        power,
        defense,
        health: 100,
      });
      res.status(201);
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
  (req, res, next) => {
    const { id } = req.params;

    try {
      const updatedFighter = fighterService.updateFighter(id, req.body);
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
  (req, res, next) => {
    const { id } = req.params;

    try {
      const fighter = fighterService.getOneFighter({ id });
      if (!fighter) {
        res.status(404);
        res.err = new Error(`Fighter with id ${id} does not exist`);
      } else {
        fighterService.deleteFighter(id);
        res.data = { message: `Fighter with id ${id} successfully deleted` };
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

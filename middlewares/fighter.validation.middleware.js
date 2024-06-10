import { FIGHTER } from "../models/fighter.js";
import { fighterService } from "../services/fighterService.js";

const createFighterValid = (req, res, next) => {
  const { name } = req.body;

  try {
    const fighter = fighterService.getOneFighter({ name });
    if (fighter) {
      res.status(400).send(`Fighter already exists`);
      return;
    }

    if (Object.keys(req.body).length !== Object.keys(FIGHTER).length - 1) {
      res.status(400).send("Invalid number of fields.");
      return;
    }

    validateFields(req.body);

    next();
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const updateFighterValid = (req, res, next) => {
  const { id } = req.params;

  try {
    const fighter = fighterService.getOneFighter({ id });
    if (!fighter) {
      res.status(404).send(`This fighter id ${id} was not found.`);
      return;
    }

    if (!Object.keys(req.body).length) {
      res.status(400).send("No fields to update.");
      return;
    }

    if (req.body.name) {
      const fighterFound = fighterService.getOneFighter({ name: req.body.name });
      if (fighterFound && fighterFound.id !== id) {
        res.status(400).send(`Fighter already exists`);
        return;
      }
    }

    validateFields(req.body);

    next();
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const validateFields = (body) => {
  const { name, power, defense } = body;

  if (name) {
    validateName(name);
  }
  if (power) {
    validatePower(power);
  }
  if (defense) {
    validateDefense(defense);
  }
};

const validateName = (name) => {
  if (!name || !name.match(/^[a-zA-Z]+$/)) {
    throw new Error("Invalid fighter name or empty field.");
  }
};

const validatePower = (power) => {
  if (
    !power ||
    isNaN(Number(power)) ||
    Number(power) < 1 ||
    Number(power) > 100
  ) {
    throw new Error("Power must be in the range 1 - 100.");
  }
};

const validateDefense = (defense) => {
  if (
    !defense ||
    isNaN(Number(defense)) ||
    Number(defense) < 1 ||
    Number(defense) > 10
  ) {
    throw new Error("Defense must be in the range 1 - 10.");
  }
};

export { createFighterValid, updateFighterValid };

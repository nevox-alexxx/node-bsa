import { FIGHTER } from "../models/fighter.js";
import { fighterService } from "../services/fighterService.js";

const createFighterValid = (req, res, next) => {
  const { name } = req.body;

  try {
    const fighter = fighterService.getOneFighter({ name });
    if (name === fighter?.name) {
      throw new Error(`Fighter already exists`);
    }

    if (Object.keys(req.body).length !== Object.keys(FIGHTER).length - 1) {
      throw new Error("Invalid number of fields.");
    }

    validateFields(req.body);

    res.data = { ...req.body };
    next();
  } catch (err) {
    res.status(400).send(err.message);
    res.err = err;
  }
};

const updateFighterValid = (req, res, next) => {
  const { id } = req.params;

  try {
    const fighter = fighterService.getOneFighter({ id });
    if (id !== fighter?.id) {
      res.status(404);
      throw new Error(`This fighter id ${id} was not found.`);
    }

    const fighterFound = fighterService.getOneFighter(req.body.name);
    if (req.body.name === fighterFound?.name) {
      throw new Error(`Fighter already exists`);
    }

    if (!Object.keys(req.body).length) {
      res.status(400);
      throw new Error("No fields to update.");
    }

    validateFields(req.body);

    res.data = { ...req.body };
    next();
  } catch (err) {
    res.status(400).send(err.message);
    res.err = err;
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
    Number(power) < 0 ||
    Number(power) > 100
  ) {
    throw new Error("Power must be in the range 0 - 100.");
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

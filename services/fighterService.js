import { fighterRepository } from "../repositories/fighterRepository.js";

class FighterService {
  getAllFighters() {
    const fighters = fighterRepository.getAll();
    return fighters.length ? fighters : [];
  }

  getOneFighter(search) {
    const fighter = fighterRepository.getOne(search);
    return fighter || null;
  }

  createFighter(body) {
    const existingFighter = fighterRepository.getOne({ name: body.name.toLowerCase() });
    if (existingFighter) {
      throw new Error(`Fighter with name ${body.name} already exists`);
    }
    const newFighter = fighterRepository.create(body);
    return newFighter || null;
  }

  updateFighter(id, body) {
    const fighter = fighterRepository.getOne({ id });
    if (!fighter) {
      throw new Error(`Fighter with id ${id} not found`);
    }
    const updatedFighter = fighterRepository.update(id, body);
    return updatedFighter || null;
  }

  deleteFighter(id) {
    const fighter = fighterRepository.getOne({ id });
    if (!fighter) {
      throw new Error(`Fighter with id ${id} does not exist`);
    }
    const deletedFighter = fighterRepository.delete(id);
    return deletedFighter || null;
  }
}

const fighterService = new FighterService();

export { fighterService };

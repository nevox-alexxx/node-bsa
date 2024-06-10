import { userRepository } from "../repositories/userRepository.js";

class UserService {
  getUsers() {
    return userRepository.getAll();
  }

  createUser(user) {
    const existingUserByEmail = userRepository.getOne({ email: user.email });
    if (existingUserByEmail) {
      throw new Error('Email already exists');
    }

    const existingUserByPhoneNumber = userRepository.getOne({ phoneNumber: user.phoneNumber });
    if (existingUserByPhoneNumber) {
      throw new Error('Phone number already exists');
    }

    const newUser = userRepository.create(user);
    if (!newUser) {
      throw new Error("Failed to create user");
    }
    return newUser;
  }

  search(criteria) {
    const foundUser = userRepository.getOne(criteria);
    if (!foundUser) {
      return null;
    }
    return foundUser;
  }

  updateUser(id, data) {
    const updatedUser = userRepository.update(id, data);
    if (!updatedUser) {
      throw new Error(`User with id ${id} not found`);
    }
    return updatedUser;
  }

  deleteUser(id) {
    const deletedUser = userRepository.delete(id);
    if (!deletedUser) {
      throw new Error(`User with id ${id} not found`);
    }
    return deletedUser;
  }
}

const userService = new UserService();

export { userService };

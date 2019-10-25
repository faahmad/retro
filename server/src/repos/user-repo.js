import uuid from "uuid/v4";

const users = {};

export class UserRepo {
  static all() {
    return Object.values(users);
  }
  static findById(id) {
    return users[id];
  }
  static addUser(input) {
    const newUser = {
      ...input,
      id: uuid(),
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    users[newUser.id] = newUser;

    return newUser;
  }
}

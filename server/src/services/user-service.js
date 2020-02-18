import db from "../models";

export class UserService {
  static async getUserById(userId) {
    return db.user.findByPk(userId);
  }
}

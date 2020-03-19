import db from "../models";

export class UserService {
  static async getUserById(userId) {
    return db.user.findByPk(userId);
  }
  static async getDefaultTeamForUser(userId) {
    const user = await db.user.findByPk(userId);
    const allTeams = await user.getTeams();
    // FIXME: Currently no support for multiple teams, so the first team
    // is the default team.
    const defaultTeam = allTeams[0];
    return defaultTeam;
  }
}

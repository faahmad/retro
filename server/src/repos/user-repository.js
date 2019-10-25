const users = {
  1: {
    id: "1",
    created_at: Date.now(),
    updated_at: Date.now(),
    first_name: "Faraz",
    last_name: "Ahmad",
    email: "faraz@retro.app",
    google_account_id: "123"
  }
};

export class UserRepo {
  static all() {
    return Object.values(users);
  }
  static findById(id) {
    return users[id];
  }
}

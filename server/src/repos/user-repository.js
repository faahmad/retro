const users = {
  1: {
    id: "1",
    first_name: "Faraz",
    last_name: "Ahmad"
  }
};

export class UserRepo {
  all() {
    console.log("all");
    return [];
  }
  findById(id) {
    console.log("findById");
    return users[id];
  }
}

class User {
  constructor() {
    this.lisOfUser = [];
  }

  addUser(id, name, room) {
    var user = { id, name, room };
    this.lisOfUser.push(user);
  }

  getUserById(id) {
    var user = this.lisOfUser.filter((user) => user.id === id)[0];
    return user;
  }

  removeUser(id) {
    var user = this.getUserById(id);
    var theList = this.lisOfUser.filter((user) => user.id != id);
    this.lisOfUser = theList;
    return user;
  }

  getListOfUserInRoom(room) {
    var theList = this.lisOfUser.filter((user) => user.room === room);
    console.log("theList getListOfUserInRoom", theList);
    return theList;
  }
}

module.exports = {
  User,
};

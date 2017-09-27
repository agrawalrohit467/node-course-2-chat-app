class Users{
    constructor(){
        this.users = [];
    }

    addUser(id, name, room, displayColor){
        var user = {id, name, room, displayColor};
        this.users.push(user);
        return user;
    }
    removeUser(id){
        var user = this.getUser(id);

        if(user){
            this.users = this.users.filter((user) => user.id !==id);
        }
        return user;
    }
    getUser(id){
        return this.users.filter((user) => user.id === id)[0];
    }
    getUserList(room){
        var users = this.users.filter((user) => user.room === room);
        var namesArray = users.map((user) => user.name);
        return namesArray;
    }
    checkDuplicateUserInRoom(name, room){
        var userCount = this.users.filter((user) => user.room === room && user.name === name).length;
        return userCount || name === 'Admin';
    }
}

module.exports = {Users};
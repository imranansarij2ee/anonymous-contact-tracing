export default class User {
    user_name : string;
    public_id : string;
    private_id: string;
    constructor(user_name : string, public_id : string, private_id: string){
        this.user_name = user_name;
        this.public_id = public_id;
        this.private_id = private_id;
    }

    isEmpty(){
        return this.user_name === "" && this.public_id === "" && this.private_id === "";
    }

    getUserName(){
        return this.user_name;
    }

    getPrivateId(){
        return this.private_id;
    }

    toObject(){
        return {
            user_name : this.user_name,
            public_id : this.public_id,
            private_id : this.private_id
        }
    }

    toPublicUser() : User {
        return new User(this.user_name, this.public_id, "");
    }

    serialize() {
        return JSON.stringify(this.toObject());
    }
}
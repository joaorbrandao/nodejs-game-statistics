import { User } from '../../Models/user.entity';

export default class LazyClientRedisObserver implements LazyClientObserver {
    user: User;
    constructor(user: User) {
        this.user = user;
    }

    handle() {
        // Instead of a console.log,
        // the next line must have the implementation of notifying Lazy Clients
        // by publishing the info into a redis channel that the Lazy Clients are listening.
        console.log('Hey '+this.user.clientId+'! Games Statistics have been updated! Go check it out! :)');
    }
}
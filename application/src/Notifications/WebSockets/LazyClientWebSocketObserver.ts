import { User } from '../../Models/user.entity';

export default class LazyClientWebSocketObserver implements LazyClientObserver {
    user: User;
    constructor(user: User) {
        this.user = user;
    }

    handle() {
        // Instead of a console.log,
        // the next line must have the implementation of notifying Lazy Clients
        // through Web Sockets.
        console.log('Hey '+this.user.clientId+'! Games Statistics have been updated! Go check it out! :)');
    }
}
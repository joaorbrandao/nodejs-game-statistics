export default class LazyClientNotifierSubject implements LazyClientSubject {
    observers: LazyClientObserver[] = [];

    attach(observer: LazyClientObserver): LazyClientSubject {
        this.observers.push(observer);
        return this;
    }

    detach(index: number) {
        delete this.observers[index];
    }

    notify() {
        this.observers.forEach((observer) => {
            observer.handle();
        });
    }
}
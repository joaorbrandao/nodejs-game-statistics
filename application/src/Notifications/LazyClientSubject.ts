interface LazyClientSubject {
    attach(observer: LazyClientObserver): LazyClientSubject;
    detach(index: number);
    notify();
}
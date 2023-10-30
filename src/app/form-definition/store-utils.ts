type SubscribeSource<T> = {
  subscribe: (listener: (state: T) => void) => () => void;
};
type SubscribeListner<T> = {
  getState: () => T;
};
const makeDerivedConnection = <T, U>(
  source: SubscribeSource<T>,
  listener: SubscribeListner<U>,
  processor: (sourceState: T, listnerState: U) => void,
) => {
  return source.subscribe(sourceState => processor(sourceState, listener.getState()));
};

export { makeDerivedConnection };

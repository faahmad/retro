export interface DataAdapter<T, F> {
  toSource: (to: T) => F;
  fromSource: (from: F) => T;
}

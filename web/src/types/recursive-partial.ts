export type RecursivePartial<Type> = {
  [Partial in keyof Type]?: RecursivePartial<Type[Partial]>;
};

interface Logger extends Console {
  /**
   * Shorthand for logger.log(JSON.stringify(object, null, 2))
   */
  prettyPrint: (object: object) => void;
}

/**
 * An extended version of Console with custom methods.
 */
export const logger: Logger = {
  ...console,
  prettyPrint: (object: object) => logger.log(JSON.stringify(object, null, 2))
};

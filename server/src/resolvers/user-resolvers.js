export const userResolvers = {
  Query: {
    async user(parent, args, context) {
      return await context.models.User.findByPk(args.id);
    },
    async users(parent, args, context) {
      return await context.models.User.findAll();
    }
  },
  Mutation: {
    async createUser(parent, { input }, context) {
      return await context.models.User.create(input);
    }
  }
};

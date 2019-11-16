export const userResolvers = {
  Query: {
    async user(parent, args, { models }) {
      return await models.user.findByPk(args.id);
    },
    async users(parent, args, { models }) {
      return await models.user.findAll();
    }
  },
  Mutation: {
    async createUser(parent, { input }, { models }) {
      return await models.user.create(input);
    }
  }
};

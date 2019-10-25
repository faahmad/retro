export const userResolvers = {
  Query: {
    user: (parent, args, context) => {
      return context.repos.user.findById(args.id);
    },
    users: (parent, args, context) => {
      return context.repos.user.all();
    }
  },
  Mutation: {
    createUser(parent, { input }, context) {
      return context.repos.user.addUser(input);
    }
  }
};

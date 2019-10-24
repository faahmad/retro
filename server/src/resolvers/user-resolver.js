export const userResolver = {
  Query: {
    user: (parent, args, context) => {
      return context.repos.user.findById(args.id);
    },
    users: (parent, args, context) => {
      return context.repos.user.all();
    }
  }
};

export const workspaceResolvers = {
  Query: {
    async workspace(parent, args, { models }) {
      return await models.workspace.findByPk(args.id);
    }
  },
  Mutation: {
    async createWorkspace(parent, { input }, { models, userId }) {
      console.log("Creating Workspace");
      console.log("*** input ***", input);
      console.log("*** userId ***", userId);
      const promise = await models.workspace.create({
        ...input,
        ownerId: userId
      });
      console.log("*** promise ***", promise);
      return promise;
    }
  }
};

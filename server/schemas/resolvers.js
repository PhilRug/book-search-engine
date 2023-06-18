const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    // Get single user
    me: async (_, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id})
      }
      throw new AuthenticationError('You need to be logged in!')
    }
  },
  Mutation: {
    // Create user
    addUser: async (_, { username, email, password }, context) => {
      const user = await User.create({ username, email, password});
      const token = signToken(user);
      return { user, token }
    },
    // Login
    
  },
};

module.exports = resolvers;
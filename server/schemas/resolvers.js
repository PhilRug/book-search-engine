const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');
const bcrypt = require('bcrypt');

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
    login: async (_, { email, password }, context) => {
      const user = await User.findOne({ email });
        if (!user) {
          throw new AuthenticationError ('No user with email found!');      
      }
      const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          throw new AuthenticationError('Incorrect password!');
      }
      const token = signToken(user);
      return { user, token };
    },
    // Save book
    
  },
};

module.exports = resolvers;
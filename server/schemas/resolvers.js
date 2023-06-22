const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');
const bcrypt = require('bcrypt');

const resolvers = {
  Query: {
    // Get single user
    me: async (_, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id })
      }
      throw new AuthenticationError('You need to be logged in!')
    }
  },
  Mutation: {
    // Create user
    addUser: async (_, { username, email, password }, context) => {
      try {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { user, token }
    } catch (error) {
        console.log('this is the error');
        console.log(error);
        throw error;
      }
      
    },
    // Login
    login: async (_, { email, password }, context) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('No user with email found!');
      }
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        throw new AuthenticationError('Incorrect password!');
      }
      const token = signToken(user);
      return { user, token };
    },
    // Save book
    saveBook: async (_, { input }, context) => {
      try {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: input } },
          { new: true }
        );
        return updatedUser;
      } 
      throw new AuthenticationError('You need to be logged in!');
      } catch (error) {
        console.log('this is the error');
        console.log(error);
        throw error;
      }
      
    },
    deleteBook: async (_, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
        if (!updatedUser) {
          return res.status(404).json({ message: "Couldn't find user with this id!" });
        }
        return (updatedUser);
      }

      throw new AuthenticationError('You need to be logged in!');
    }
  },
};

module.exports = resolvers;
import User from './user.model';
import HttpError from '../http.error';

const findUserByEmail = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    const error = new HttpError("User not found", 404);
    throw error;
  }

  return user;
};

const signup = async (
  name: string,
  email: string,
  password: string,
  registrationDate: Date,
  dateOfBirth: Date,
  location: string
) => {
  const createdUser = new User({
    name,
    email,
    password,
    registrationDate,
    dateOfBirth,
    location,
  });

  try {
    await createdUser.save();
  } catch (error) {
    const httpError = new HttpError("Could not create a user", 500);
    throw httpError;
  }

  return createdUser;
};

const login = async (email: string, password: string) => {
  const user = await User.findOne({ email, password });

  if (!user) {
    const error = new HttpError("Invalid email or password", 401);
    throw error;
  }

  return user;
};

const viewProfile = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new HttpError("User not found", 404);
    throw error;
  }

  return user;
};

const editProfile = async (userId: string, firstName: string, lastName: string, dateOfBirth: Date) => {
  const updatedUser = await User.findByIdAndUpdate(userId, { firstName, lastName, dateOfBirth }, { new: true });

  if (!updatedUser) {
    const error = new HttpError("User not found", 404);
    throw error;
  }

  return updatedUser;
};

export { findUserByEmail, signup, login, viewProfile, editProfile };

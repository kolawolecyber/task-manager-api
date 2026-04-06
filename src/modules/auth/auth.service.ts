import { User } from "./user.model";
import { hashPassword, comparePassword } from "../../shared/utils/hash";
import { generateToken } from "../../shared/utils/jwt";

export const registerUser = async (data: any) => {
  const existingUser = await User.findOne({ email: data.email });

  if (existingUser) {
    throw new Error("Email already in use");
  }

  const hashedPassword = await hashPassword(data.password);

  const user = await User.create({
    ...data,
    password: hashedPassword,
  });

  return {
    id: user._id,
    email: user.email,
    name: user.name,
  };
};

export const loginUser = async (data: any) => {
  const user = await User.findOne({ email: data.email });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await comparePassword(data.password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken({
    userId: user._id,
    email: user.email,
  });

  return {
    token,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
    },
  };
};
export const getAllUsersService = async () => {
  
  return await User.find({}, "name _id");
};
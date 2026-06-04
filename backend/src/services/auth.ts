import bcrypt from "bcrypt";
import prisma from "../config/prisma";
import { registerValidation,loginValidation, registerInput ,loginInput } from "../validations/auth";
import { generateToken } from "../utils/jwt";


export const register = async (data: registerInput) => {
  const validateData = registerValidation.parse(data);

  const userExist = await prisma.user.findUnique({
    where: {
      email: validateData.email,
    },
  });

  if (userExist) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(validateData.password, 10);

  const user = await prisma.user.create({
    data: {
      name: validateData.name,
      email: validateData.email,
      password: hashedPassword,
    },
  });

  return {
  id_user: user.id_user,
  name: user.name,
  email: user.email,
  role: user.role,
};
};


export const login = async (
  data: loginInput
) => {
  const validateData = loginValidation.parse(data);

  const user = await prisma.user.findUnique({
    where: {
      email: validateData.email,
    },
  });

  if (!user) {
    throw new Error("Email not found");
  }

  const isMatch = await bcrypt.compare(
    validateData.password,
    user.password
  );

  if (!isMatch) {
    throw new Error("Invalid password");
  }

  const token = generateToken(
    user.id_user,
    user.role
  );

  return {
    token,
    user: {
      id: user.id_user,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};
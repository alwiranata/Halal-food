import bcrypt from "bcrypt";
import prisma from "../config/prisma";
import { RegisterInput } from "../types/auth";

export const register = async (data: RegisterInput) => {
  const userExist = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (userExist) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
    },
  });

  return user;
};

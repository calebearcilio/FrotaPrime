import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { EmailAlreadyExistsError } from "../errors/auth/EmailAlreadyExistsError";
import { PasswordsNotMatchError } from "../errors/auth/PasswordsNotMatchError";
import { UserNotFoundError } from "../errors/auth/UserNotFoundError";
import { prisma } from "../repository/prisma";
import { AuthLoginData, AuthSignupData } from "../schemas/authSchema";

const JWT_SECRET = process.env.JWT_SECRET!;

type DataResponse = {
  data: {
    email: string;
    id: number;
    name: string;
    createdAt: Date;
  };
  token: string;
};

class AuthService {
  private generateToken(id: number, email: string): string {
    return jwt.sign({ id: id, email: email }, JWT_SECRET, {
      expiresIn: "1d",
    });
  }

  async login(authData: AuthLoginData): Promise<DataResponse> {
    const userData = await prisma.user.findUnique({
      where: {
        email: authData.email,
      },
    });

    if (!userData) {
      throw new UserNotFoundError();
    }

    const passwordIsValid = await bcrypt.compare(
      authData.password,
      userData.password,
    );

    if (!passwordIsValid) {
      throw new PasswordsNotMatchError();
    }

    const token = this.generateToken(userData.id, userData.email);

    const { password, ...userWithoutPassword } = userData;

    const user = {
      data: userWithoutPassword,
      token: token,
    };

    return user;
  }

  async signup(authData: AuthSignupData): Promise<DataResponse> {
    const existingUser = await prisma.user.findUnique({
      where: { email: authData.email },
    });

    if (existingUser) {
      throw new EmailAlreadyExistsError();
    }

    const passwordHash = await bcrypt.hash(authData.password, 10);

    const userData = await prisma.user.create({
      data: {
        name: authData.name,
        email: authData.email,
        password: passwordHash,
      },
    });

    const token = this.generateToken(userData.id, userData.email);

    const { password, ...userWithoutPassword } = userData;

    const user = {
      data: userWithoutPassword,
      token: token,
    };

    return user;
  }
}

export default new AuthService();

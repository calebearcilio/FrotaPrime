import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { EmailAlreadyExistsError } from "../errors/auth/EmailAlreadyExistsError";
import { InvalidCredentialsError } from "../errors/auth/InvalidCredentialsError";
import { PasswordsNotMatchError } from "../errors/auth/PasswordsNotMatchError";
import { prisma } from "../repository/prisma";
import { AuthLoginData, AuthSignupData } from "../schemas/authSchema";
import { TokenPayload } from "../types/TokenPayload";

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
    return jwt.sign({ id, email } as TokenPayload, JWT_SECRET, {
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
      throw new InvalidCredentialsError();
    }

    const passwordIsValid = await bcrypt.compare(
      authData.password,
      userData.password,
    );

    if (!passwordIsValid) {
      throw new InvalidCredentialsError();
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

    if (authData.password !== authData.confirmPassword) {
      throw new PasswordsNotMatchError();
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

    const response = {
      data: userWithoutPassword,
      token: token,
    };

    return response;
  }
}

export default new AuthService();

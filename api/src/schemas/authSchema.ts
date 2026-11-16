import z from "zod";

export const loginSchema = z.object({
  email: z.email("E-mail inválido").min(1, "E-mail é obrigatório"),
  password: z
    .string("Senha inválida")
    .min(1, "Senha é obrigatória")
    .min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export const signupSchema = loginSchema.extend({
  name: z
    .string("Nome inválido")
    .min(2, "Nome deve ter pelo menos 2 caracteres"),
  confirmPassword: z
    .string("Confirmação de senha inválida")
    .min(1, "Confirmação de senha é obrigatória")
    .min(6, "Confirmação de senha deve ter pelo menos 6 caracteres"),
});

export type AuthLoginData = z.infer<typeof loginSchema>;
export type AuthSignupData = z.infer<typeof signupSchema>;

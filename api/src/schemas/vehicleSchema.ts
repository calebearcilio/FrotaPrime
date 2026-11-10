import z from "zod";

export const createVehicleSchema = z.object({
  marca: z.string().trim().min(1, "Marca é obrigatória"),
  modelo: z.string().trim().min(1, "Modelo é obrigatório"),
  placa: z.string().trim().min(1, "Placa é obrigatória"),
  ano: z.number().int("Ano deve ser um número inteiro"),
  valorDiaria: z.number().positive("Valor da diária deve ser positivo"),
});

export const listVehiclesQuerySchema = z.object({
  disponivel: z.enum(["true", "false"]).optional(),
});

export type CreateVehicleData = z.infer<typeof createVehicleSchema>;
import z from "zod";

export const createVehicleSchema = z.object({
  brand: z.string("Marca inválida").trim().min(1, "Marca é obrigatória"),
  model: z.string("Modelo inválido").trim().min(1, "Modelo é obrigatório"),
  licensePlate: z
    .string("Placa inválida")
    .trim()
    .min(1, "Placa é obrigatória"),
  year: z
    .number("Ano deve ser um número")
    .int("Ano deve ser um número inteiro"),
  dailyRate: z
    .number("Valor da diária deve ser um número")
    .positive("Valor da diária deve ser positivo"),
});

export const listVehiclesQuerySchema = z.object({
  disponivel: z.enum(["true", "false"]).optional(),
});

export type CreateVehicleData = z.infer<typeof createVehicleSchema>;
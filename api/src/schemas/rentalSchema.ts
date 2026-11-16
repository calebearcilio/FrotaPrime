import z from "zod";

export const createRentalSchema = z
  .object({
    vehicleId: z
      .number("Veículo deve ser um número")
      .int("Veículo deve ser um número inteiro")
      .positive("Veículo deve ser positivo"),
    startDate: z.coerce.date("Data de início inválida"),
    expectedReturnDate: z.coerce.date("Data prevista de devolução inválida"),
  })
  .refine((data) => data.expectedReturnDate > data.startDate, {
    message: "Data prevista de devolução deve ser posterior à data de início",
    path: ["expectedReturnDate"],
  });

export type CreateRentalData = z.infer<typeof createRentalSchema>;
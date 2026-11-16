import z from "zod";

export const createRentalSchema = z
  .object({
    veiculoId: z
      .number("Veículo deve ser um número")
      .int("Veículo deve ser um número inteiro")
      .positive("Veículo deve ser positivo"),
    dataInicio: z.coerce.date("Data de início inválida"),
    dataPrevistaDevolucao: z.coerce.date("Data prevista de devolução inválida"),
  })
  .refine((data) => data.dataPrevistaDevolucao > data.dataInicio, {
    message: "Data prevista de devolução deve ser posterior à data de início",
    path: ["dataPrevistaDevolucao"],
  });

export type CreateRentalData = z.infer<typeof createRentalSchema>;

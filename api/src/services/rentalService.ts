import { VehicleNotFoundError } from "../errors/vehicles/VehicleNotFoundError";
import { VehicleUnavailableError } from "../errors/vehicles/VehicleUnavailableError";
import { prisma } from "../repository/prisma";
import { CreateRentalData } from "../schemas/rentalSchema";

const toRentalResponse = (rental: {
  id: number;
  userId: number;
  vehicleId: number;
  startDate: Date;
  expectedReturnDate: Date;
  returnDate: Date | null;
  totalAmount: { toNumber(): number };
  status: string;
}) => ({
  id: rental.id,
  usuarioId: rental.userId,
  veiculoId: rental.vehicleId,
  dataInicio: rental.startDate,
  dataPrevistaDevolucao: rental.expectedReturnDate,
  dataDevolucao: rental.returnDate,
  valorTotal: rental.totalAmount.toNumber(),
  status: rental.status,
});

const DAY_IN_MS = 24 * 60 * 60 * 1000;

class RentalService {
  calculateDays(startDate: Date, expectedReturnDate: Date): number {
    const difference = expectedReturnDate.getTime() - startDate.getTime();
    return Math.max(1, Math.ceil(difference / DAY_IN_MS));
  }

  async create(userId: number, rentalData: CreateRentalData) {
    const rental = await prisma.$transaction(async (tx) => {
      const vehicle = await tx.vehicle.findUnique({
        where: { id: rentalData.veiculoId },
      });

      if (!vehicle) {
        throw new VehicleNotFoundError();
      }

      const days = this.calculateDays(
        rentalData.dataInicio,
        rentalData.dataPrevistaDevolucao,
      );
      const totalAmount = vehicle.dailyRate.mul(days);

      const reserved = await tx.vehicle.updateMany({
        where: { id: vehicle.id, available: true },
        data: { available: false },
      });

      if (reserved.count === 0) {
        throw new VehicleUnavailableError();
      }

      return tx.rental.create({
        data: {
          userId,
          vehicleId: vehicle.id,
          startDate: rentalData.dataInicio,
          expectedReturnDate: rentalData.dataPrevistaDevolucao,
          totalAmount,
        },
      });
    });

    return toRentalResponse(rental);
  }
}

export default new RentalService();

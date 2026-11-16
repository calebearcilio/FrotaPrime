import { VehicleNotFoundError } from "../errors/vehicles/VehicleNotFoundError";
import { VehicleUnavailableError } from "../errors/vehicles/VehicleUnavailableError";
import { RentalAlreadyFinalizedError } from "../errors/rentals/RentalAlreadyFinalizedError";
import { RentalForbiddenError } from "../errors/rentals/RentalForbiddenError";
import { RentalNotFoundError } from "../errors/rentals/RentalNotFoundError";
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
  vehicle: {
    id: number;
    brand: string;
    model: string;
    licensePlate: string;
    year: number;
    dailyRate: { toNumber(): number };
    available: boolean;
  };
}) => ({
  id: rental.id,
  usuarioId: rental.userId,
  veiculoId: rental.vehicleId,
  dataInicio: rental.startDate,
  dataPrevistaDevolucao: rental.expectedReturnDate,
  dataDevolucao: rental.returnDate,
  valorTotal: rental.totalAmount.toNumber(),
  status: rental.status,
  veiculo: {
    id: rental.vehicle.id,
    marca: rental.vehicle.brand,
    modelo: rental.vehicle.model,
    placa: rental.vehicle.licensePlate,
    ano: rental.vehicle.year,
    valorDiaria: rental.vehicle.dailyRate.toNumber(),
    disponivel: rental.vehicle.available,
  },
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
        include: { vehicle: true },
      });
    });

    return toRentalResponse(rental);
  }

  async finalize(userId: number, rentalId: number) {
    const rental = await prisma.$transaction(async (tx) => {
      const existingRental = await tx.rental.findUnique({
        where: { id: rentalId },
      });

      if (!existingRental) {
        throw new RentalNotFoundError();
      }

      if (existingRental.userId !== userId) {
        throw new RentalForbiddenError();
      }

      if (existingRental.status === "FINALIZADA") {
        throw new RentalAlreadyFinalizedError();
      }

      const updatedRental = await tx.rental.updateMany({
        where: { id: rentalId, userId, status: "ACTIVE" },
        data: { returnDate: new Date(), status: "FINALIZADA" },
      });

      if (updatedRental.count === 0) {
        throw new RentalAlreadyFinalizedError();
      }

      await tx.vehicle.update({
        where: { id: existingRental.vehicleId },
        data: { available: true },
      });

      return tx.rental.findUniqueOrThrow({
        where: { id: rentalId },
        include: { vehicle: true },
      });
    });

    return toRentalResponse(rental);
  }

  async list(userId: number) {
    const rentals = await prisma.rental.findMany({
      where: { userId },
      include: { vehicle: true },
      orderBy: { id: "asc" },
    });

    return rentals.map(toRentalResponse);
  }
}

export default new RentalService();

import { VehicleNotFoundError } from "../errors/vehicles/VehicleNotFoundError";
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

class RentalService {
  async create(userId: number, rentalData: CreateRentalData) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: rentalData.veiculoId },
    });

    if (!vehicle) {
      throw new VehicleNotFoundError();
    }

    const rental = await prisma.rental.create({
      data: {
        userId,
        vehicleId: vehicle.id,
        startDate: rentalData.dataInicio,
        expectedReturnDate: rentalData.dataPrevistaDevolucao,
        totalAmount: vehicle.dailyRate,
      },
    });

    return toRentalResponse(rental);
  }
}

export default new RentalService();

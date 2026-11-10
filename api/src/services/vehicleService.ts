import { VehicleAlreadyExistsError } from "../errors/vehicles/VehicleAlreadyExistsError";
import { prisma } from "../repository/prisma";
import { CreateVehicleData } from "../schemas/vehicleSchema";

const toVehicleResponse = (vehicle: {
  id: number;
  brand: string;
  model: string;
  licensePlate: string;
  year: number;
  dailyRate: { toNumber(): number };
  available: boolean;
}) => ({
  id: vehicle.id,
  marca: vehicle.brand,
  modelo: vehicle.model,
  placa: vehicle.licensePlate,
  ano: vehicle.year,
  valorDiaria: vehicle.dailyRate.toNumber(),
  disponivel: vehicle.available,
});

class VehicleService {
  async create(vehicleData: CreateVehicleData) {
    try {
      const vehicle = await prisma.vehicle.create({
        data: {
          brand: vehicleData.marca,
          model: vehicleData.modelo,
          licensePlate: vehicleData.placa,
          year: vehicleData.ano,
          dailyRate: vehicleData.valorDiaria,
        },
      });

      return toVehicleResponse(vehicle);
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "P2002"
      ) {
        throw new VehicleAlreadyExistsError();
      }

      throw error;
    }
  }

  async list(available?: boolean) {
    const vehicles = await prisma.vehicle.findMany({
      ...(available === undefined ? {} : { where: { available } }),
      orderBy: { id: "asc" },
    });

    return vehicles.map(toVehicleResponse);
  }
}

export default new VehicleService();
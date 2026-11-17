import bcrypt from "bcrypt";
import { prisma } from "../src/repository/prisma";

const DEFAULT_PASSWORD = "senha123";

const users = [
  { name: "Admin FrotaPrime", email: "admin@frotaprime.com" },
  { name: "Ana Souza", email: "ana.souza@frotaprime.com" },
  { name: "Bruno Lima", email: "bruno.lima@frotaprime.com" },
  { name: "Carla Mendes", email: "carla.mendes@frotaprime.com" },
];

const vehicles = [
  { brand: "Fiat", model: "Argo", licensePlate: "BRA2E19", year: 2023, dailyRate: 129.9 },
  { brand: "Volkswagen", model: "Polo", licensePlate: "RIO4A21", year: 2024, dailyRate: 149.9 },
  { brand: "Chevrolet", model: "Onix", licensePlate: "SPX3C45", year: 2023, dailyRate: 139.9 },
  { brand: "Toyota", model: "Corolla", licensePlate: "MGA7B88", year: 2024, dailyRate: 249.9 },
  { brand: "Hyundai", model: "HB20", licensePlate: "PRC1D32", year: 2022, dailyRate: 119.9 },
  { brand: "Jeep", model: "Compass", licensePlate: "SCT5F67", year: 2024, dailyRate: 299.9 },
  { brand: "Renault", model: "Kwid", licensePlate: "BAH8G10", year: 2022, dailyRate: 99.9 },
  { brand: "Honda", model: "Civic", licensePlate: "CEA6H54", year: 2023, dailyRate: 269.9 },
];

async function main() {
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: { name: user.name, password: passwordHash },
      create: { ...user, password: passwordHash },
    });
  }

  for (const vehicle of vehicles) {
    await prisma.vehicle.upsert({
      where: { licensePlate: vehicle.licensePlate },
      update: vehicle,
      create: vehicle,
    });
  }

  console.log(`Seed concluído: ${users.length} usuários e ${vehicles.length} veículos.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

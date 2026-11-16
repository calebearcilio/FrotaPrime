import type { Vehicle } from "../api/api";

type VehicleListProps = {
  vehicles: Vehicle[];
  isLoading: boolean;
  error: string | null;
};

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const VehicleList = ({ vehicles, isLoading, error }: VehicleListProps) => {
  if (isLoading) {
    return <p className="list-state">Carregando veículos...</p>;
  }

  if (error) {
    return <p className="form-notice error" role="alert">{error}</p>;
  }

  if (vehicles.length === 0) {
    return <p className="list-state">Nenhum veículo encontrado.</p>;
  }

  return (
    <div className="table-wrapper">
      <table className="vehicle-table">
        <thead>
          <tr>
            <th scope="col">Marca</th>
            <th scope="col">Modelo</th>
            <th scope="col">Placa</th>
            <th scope="col">Ano</th>
            <th scope="col" className="numeric">Diária</th>
            <th scope="col">Situação</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => (
            <tr key={vehicle.id}>
              <td>{vehicle.marca}</td>
              <td>{vehicle.modelo}</td>
              <td className="plate">{vehicle.placa}</td>
              <td>{vehicle.ano}</td>
              <td className="numeric">{currencyFormatter.format(vehicle.valorDiaria)}</td>
              <td>
                <span className={`status-badge ${vehicle.disponivel ? "available" : "unavailable"}`}>
                  {vehicle.disponivel ? "Disponível" : "Indisponível"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VehicleList;

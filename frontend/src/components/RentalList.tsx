import type { Rental } from "../api/api";

type RentalListProps = {
  rentals: Rental[];
  isLoading: boolean;
  error: string | null;
  finalizingId: number | null;
  onFinalize: (rentalId: number) => void;
};

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "UTC",
});

const formatDate = (isoDate: string | null) => {
  if (!isoDate) return "—";
  return dateFormatter.format(new Date(isoDate));
};

const RentalList = ({
  rentals,
  isLoading,
  error,
  finalizingId,
  onFinalize,
}: RentalListProps) => {
  if (isLoading) {
    return <p className="list-state">Carregando locações...</p>;
  }

  if (error) {
    return (
      <p className="form-notice error" role="alert">
        {error}
      </p>
    );
  }

  if (rentals.length === 0) {
    return <p className="list-state">Nenhuma locação encontrada.</p>;
  }

  return (
    <div className="table-wrapper">
      <table className="vehicle-table">
        <thead>
          <tr>
            <th scope="col">Veículo</th>
            <th scope="col">Placa</th>
            <th scope="col">Início</th>
            <th scope="col">Prev. Devolução</th>
            <th scope="col">Devolução</th>
            <th scope="col" className="numeric">
              Valor Total
            </th>
            <th scope="col">Status</th>
            <th scope="col">Ações</th>
          </tr>
        </thead>
        <tbody>
          {rentals.map((rental) => {
            const isActive = rental.status === "ACTIVE";
            const isFinalizing = finalizingId === rental.id;

            return (
              <tr key={rental.id}>
                <td>
                  {rental.vehicle.brand} {rental.vehicle.model}
                </td>
                <td className="plate">{rental.vehicle.licensePlate}</td>
                <td>{formatDate(rental.startDate)}</td>
                <td>{formatDate(rental.expectedReturnDate)}</td>
                <td>{formatDate(rental.returnDate)}</td>
                <td className="numeric">
                  {currencyFormatter.format(rental.totalAmount)}
                </td>
                <td>
                  <span
                    className={`status-badge ${
                      isActive ? "available" : "finalized"
                    }`}
                  >
                    {isActive ? "Ativa" : "Finalizada"}
                  </span>
                </td>
                <td>
                  {isActive ? (
                    <button
                      type="button"
                      className="action-button"
                      onClick={() => onFinalize(rental.id)}
                      disabled={isFinalizing}
                    >
                      {isFinalizing ? "Finalizando..." : "Finalizar"}
                    </button>
                  ) : (
                    <span className="rental-done-label">Concluída</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default RentalList;
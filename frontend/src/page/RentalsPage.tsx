import { useEffect, useState } from "react";
import api, { getApiErrorMessage } from "../api/api";
import type { Rental } from "../api/api";
import RentalForm from "../components/RentalForm";
import RentalList from "../components/RentalList";

const RentalsPage = () => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [reloadKey, setReloadKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [finalizingId, setFinalizingId] = useState<number | null>(null);

  useEffect(() => {
    let isActive = true;

    api
      .get<Rental[]>("/locacoes")
      .then((response) => {
        if (!isActive) return;
        setRentals(response.data);
        setError(null);
      })
      .catch((err: unknown) => {
        if (!isActive) return;
        setError(
          getApiErrorMessage(err, "Não foi possível carregar as locações."),
        );
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [reloadKey]);

  const handleRentalCreated = () => {
    setActionError(null);
    setActionSuccess(null);
    setIsLoading(true);
    setReloadKey((key) => key + 1);
  };

  const handleFinalizeRental = async (rentalId: number) => {
    setActionError(null);
    setActionSuccess(null);
    setFinalizingId(rentalId);

    try {
      const response = await api.patch<Rental>(
        `/locacoes/${rentalId}/finalizar`,
      );
      setRentals((current) =>
        current.map((item) => (item.id === rentalId ? response.data : item)),
      );
      setActionSuccess(
        `Locação #${response.data.id} (${response.data.vehicle.licensePlate}) finalizada com sucesso.`,
      );
      setReloadKey((key) => key + 1);
    } catch (err: unknown) {
      setActionError(
        getApiErrorMessage(
          err,
          "Não foi possível finalizar a locação. Tente novamente.",
        ),
      );
    } finally {
      setFinalizingId(null);
    }
  };

  return (
    <div className="vehicles-page">
      <h1>Locações</h1>
      <div className="vehicles-grid">
        <RentalForm reloadTrigger={reloadKey} onCreated={handleRentalCreated} />

        <section className="panel">
          <div className="panel-heading list-heading">
            <div>
              <p className="eyebrow">HISTÓRICO</p>
              <h2>Minhas locações</h2>
            </div>
          </div>

          {actionError && (
            <p className="form-notice error" role="alert">
              {actionError}
            </p>
          )}

          {actionSuccess && (
            <p className="form-notice success" role="status">
              {actionSuccess}
            </p>
          )}

          <RentalList
            rentals={rentals}
            isLoading={isLoading}
            error={error}
            finalizingId={finalizingId}
            onFinalize={handleFinalizeRental}
          />
        </section>
      </div>
    </div>
  );
};

export default RentalsPage;
import { useEffect, useState } from "react";
import api, { getApiErrorMessage } from "../api/api";
import type { Vehicle } from "../api/api";
import VehicleForm from "../components/VehicleForm";
import VehicleList from "../components/VehicleList";

type AvailabilityFilter = "todos" | "true" | "false";

const AutomobilePage = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filter, setFilter] = useState<AvailabilityFilter>("todos");
  const [reloadKey, setReloadKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    api
      .get<Vehicle[]>("/veiculos", {
        params: filter === "todos" ? undefined : { disponivel: filter },
      })
      .then((response) => {
        if (!isActive) return;
        setVehicles(response.data);
        setError(null);
      })
      .catch((error: unknown) => {
        if (!isActive) return;
        setError(getApiErrorMessage(error, "Não foi possível carregar os veículos."));
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [filter, reloadKey]);

  const handleFilterChange = (value: AvailabilityFilter) => {
    setIsLoading(true);
    setFilter(value);
  };

  const handleVehicleCreated = () => {
    setIsLoading(true);
    setReloadKey((key) => key + 1);
  };

  return (
    <div className="vehicles-page">
      <h1>Veículos</h1>
      <div className="vehicles-grid">
        <VehicleForm onCreated={handleVehicleCreated} />

        <section className="panel">
          <div className="panel-heading list-heading">
            <div>
              <p className="eyebrow">FROTA</p>
              <h2>Veículos cadastrados</h2>
            </div>
            <div className="filter-field">
              <label className="field-label" htmlFor="vehicle-filter">Disponibilidade</label>
              <select
                id="vehicle-filter"
                value={filter}
                onChange={(event) => handleFilterChange(event.target.value as AvailabilityFilter)}
              >
                <option value="todos">Todos</option>
                <option value="true">Disponíveis</option>
                <option value="false">Indisponíveis</option>
              </select>
            </div>
          </div>

          <VehicleList vehicles={vehicles} isLoading={isLoading} error={error} />
        </section>
      </div>
    </div>
  );
};

export default AutomobilePage;

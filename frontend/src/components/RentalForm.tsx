import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import api, { getApiErrorMessage } from "../api/api";
import type { Rental, Vehicle } from "../api/api";

type RentalFormData = {
  veiculoId: string;
  dataInicio: string;
  dataPrevistaDevolucao: string;
};

type RentalFormProps = {
  reloadTrigger?: number;
  onCreated: (rental: Rental) => void;
};

const emptyForm: RentalFormData = {
  veiculoId: "",
  dataInicio: "",
  dataPrevistaDevolucao: "",
};

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const RentalForm = ({ reloadTrigger = 0, onCreated }: RentalFormProps) => {
  const [form, setForm] = useState<RentalFormData>(emptyForm);
  const [availableVehicles, setAvailableVehicles] = useState<Vehicle[]>([]);
  const [vehiclesReloadKey, setVehiclesReloadKey] = useState(0);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [createdRental, setCreatedRental] = useState<Rental | null>(null);

  useEffect(() => {
    let isActive = true;

    api
      .get<Vehicle[]>("/veiculos", {
        params: { disponivel: "true" },
      })
      .then((response) => {
        if (!isActive) return;
        setAvailableVehicles(response.data);
      })
      .catch((error: unknown) => {
        if (!isActive) return;
        setNotice(
          getApiErrorMessage(
            error,
            "Não foi possível carregar os veículos disponíveis.",
          ),
        );
      })
      .finally(() => {
        if (isActive) setIsLoadingVehicles(false);
      });

    return () => {
      isActive = false;
    };
  }, [reloadTrigger, vehiclesReloadKey]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice(null);
    setCreatedRental(null);

    if (form.dataPrevistaDevolucao <= form.dataInicio) {
      setNotice("A data prevista de devolução deve ser posterior à data de início.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post<Rental>("/locacoes", {
        veiculoId: Number(form.veiculoId),
        dataInicio: form.dataInicio,
        dataPrevistaDevolucao: form.dataPrevistaDevolucao,
      });

      setForm(emptyForm);
      setCreatedRental(response.data);
      setIsLoadingVehicles(true);
      setVehiclesReloadKey((key) => key + 1);
      onCreated(response.data);
    } catch (error: unknown) {
      setNotice(
        getApiErrorMessage(
          error,
          "Não foi possível registrar a locação. Tente novamente.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="panel">
      <div className="panel-heading">
        <p className="eyebrow">NOVA LOCAÇÃO</p>
        <h2>Registrar locação</h2>
      </div>

      <form className="vehicle-form" onSubmit={handleSubmit}>
        <div className="field">
          <label className="field-label" htmlFor="rental-vehicle">
            Veículo disponível
          </label>
          <select
            id="rental-vehicle"
            name="veiculoId"
            value={form.veiculoId}
            onChange={(event) =>
              setForm({ ...form, veiculoId: event.target.value })
            }
            disabled={isLoadingVehicles || availableVehicles.length === 0}
            required
          >
            <option value="">
              {isLoadingVehicles
                ? "Carregando veículos..."
                : availableVehicles.length === 0
                  ? "Nenhum veículo disponível"
                  : "Selecione um veículo"}
            </option>
            {availableVehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.marca} {vehicle.modelo} — {vehicle.placa} (
                {currencyFormatter.format(vehicle.valorDiaria)}/dia)
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="field-label" htmlFor="rental-start-date">
            Data de início
          </label>
          <input
            id="rental-start-date"
            name="dataInicio"
            type="date"
            value={form.dataInicio}
            onChange={(event) =>
              setForm({ ...form, dataInicio: event.target.value })
            }
            required
          />
        </div>

        <div className="field">
          <label className="field-label" htmlFor="rental-return-date">
            Data prevista de devolução
          </label>
          <input
            id="rental-return-date"
            name="dataPrevistaDevolucao"
            type="date"
            min={form.dataInicio || undefined}
            value={form.dataPrevistaDevolucao}
            onChange={(event) =>
              setForm({ ...form, dataPrevistaDevolucao: event.target.value })
            }
            required
          />
        </div>

        {notice && (
          <p className="form-notice error" role="alert">
            {notice}
          </p>
        )}

        {createdRental && (
          <div className="form-notice success rental-summary" role="status">
            <strong>Locação #{createdRental.id} registrada com sucesso!</strong>
            <span>
              Veículo: {createdRental.vehicle.marca}{" "}
              {createdRental.vehicle.modelo} ({createdRental.vehicle.placa})
            </span>
            <span>
              Valor calculado pela API:{" "}
              <strong>
                {currencyFormatter.format(createdRental.totalAmount)}
              </strong>
            </span>
          </div>
        )}

        <button
          className="submit-button"
          type="submit"
          disabled={
            isSubmitting || isLoadingVehicles || availableVehicles.length === 0
          }
        >
          {isSubmitting ? "Registrando..." : "Registrar locação"}
        </button>
      </form>
    </section>
  );
};

export default RentalForm;
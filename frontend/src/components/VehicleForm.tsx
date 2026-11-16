import axios from "axios";
import { useState } from "react";
import type { FormEvent } from "react";
import api, { getApiErrorMessage } from "../api/api";
import type { Vehicle } from "../api/api";

type VehicleFormData = {
  brand: string;
  model: string;
  licensePlate: string;
  year: string;
  dailyRate: string;
};

type VehicleFormProps = {
  onCreated: (vehicle: Vehicle) => void;
};

const emptyForm: VehicleFormData = {
  brand: "",
  model: "",
  licensePlate: "",
  year: "",
  dailyRate: "",
};

const DUPLICATE_PLATE_MESSAGE = "Já existe um veículo cadastrado com esta placa.";

const VehicleForm = ({ onCreated }: VehicleFormProps) => {
  const [form, setForm] = useState<VehicleFormData>(emptyForm);
  const [notice, setNotice] = useState<string | null>(null);
  const [plateError, setPlateError] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice(null);
    setPlateError(false);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const response = await api.post<Vehicle>("/veiculos", {
        brand: form.brand,
        model: form.model,
        licensePlate: form.licensePlate.trim().toUpperCase(),
        year: Number(form.year),
        dailyRate: Number(form.dailyRate),
      });
      setForm(emptyForm);
      setSuccess(`Veículo ${response.data.licensePlate} cadastrado com sucesso.`);
      onCreated(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setPlateError(true);
        setNotice(DUPLICATE_PLATE_MESSAGE);
      } else {
        setNotice(
          getApiErrorMessage(
            error,
            "Não foi possível cadastrar o veículo. Tente novamente.",
          ),
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="panel">
      <div className="panel-heading">
        <p className="eyebrow">NOVO VEÍCULO</p>
        <h2>Cadastrar veículo</h2>
      </div>

      <form className="vehicle-form" onSubmit={handleSubmit}>
        <div className="field">
          <label className="field-label" htmlFor="vehicle-brand">Marca</label>
          <input
            id="vehicle-brand"
            name="brand"
            type="text"
            placeholder="Fiat"
            value={form.brand}
            onChange={(event) => setForm({ ...form, brand: event.target.value })}
            required
          />
        </div>

        <div className="field">
          <label className="field-label" htmlFor="vehicle-model">Modelo</label>
          <input
            id="vehicle-model"
            name="model"
            type="text"
            placeholder="Argo"
            value={form.model}
            onChange={(event) => setForm({ ...form, model: event.target.value })}
            required
          />
        </div>

        <div className="field">
          <label className="field-label" htmlFor="vehicle-plate">Placa</label>
          <input
            id="vehicle-plate"
            name="licensePlate"
            type="text"
            placeholder="ABC1D23"
            value={form.licensePlate}
            onChange={(event) => {
              setForm({ ...form, licensePlate: event.target.value });
              if (plateError) {
                setPlateError(false);
                setNotice(null);
              }
            }}
            aria-invalid={plateError}
            aria-describedby={plateError ? "vehicle-plate-error" : undefined}
            maxLength={8}
            required
          />
          {plateError && (
            <span id="vehicle-plate-error" className="field-error">
              {DUPLICATE_PLATE_MESSAGE}
            </span>
          )}
        </div>

        <div className="field">
          <label className="field-label" htmlFor="vehicle-year">Ano</label>
          <input
            id="vehicle-year"
            name="year"
            type="number"
            placeholder="2024"
            value={form.year}
            onChange={(event) => setForm({ ...form, year: event.target.value })}
            min={1900}
            max={new Date().getFullYear() + 1}
            step={1}
            required
          />
        </div>

        <div className="field">
          <label className="field-label" htmlFor="vehicle-daily-rate">
            Valor da diária (R$)
          </label>
          <input
            id="vehicle-daily-rate"
            name="dailyRate"
            type="number"
            placeholder="150.00"
            value={form.dailyRate}
            onChange={(event) =>
              setForm({ ...form, dailyRate: event.target.value })
            }
            min={0.01}
            step={0.01}
            required
          />
        </div>

        {notice && <p className="form-notice error" role="alert">{notice}</p>}
        {success && <p className="form-notice success" role="status">{success}</p>}

        <button className="submit-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Cadastrando..." : "Cadastrar veículo"}
        </button>
      </form>
    </section>
  );
};

export default VehicleForm;
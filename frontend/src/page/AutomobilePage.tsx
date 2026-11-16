import VehicleForm from "../components/VehicleForm";

const AutomobilePage = () => {
  return (
    <div className="vehicles-page">
      <h1>Veículos</h1>
      <div className="vehicles-grid">
        <VehicleForm onCreated={() => undefined} />
      </div>
    </div>
  );
};

export default AutomobilePage;

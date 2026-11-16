import RentalForm from "../components/RentalForm";

const LocacoesPage = () => {
  return (
    <div className="vehicle-page">
      <h1>Locações</h1>
      <div className="vehicle-grid">
        <RentalForm onCreated={() => undefined} />
      </div>
    </div>
  );
};

export default LocacoesPage;

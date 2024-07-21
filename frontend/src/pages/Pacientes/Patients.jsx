import Navbar from "../../components/Navbar";
import SearchPatients from "../../sections/Pacientes/SearchPatients";

export default function Patients() {
  return (
    <div className="bg-[#fafdff] min-h-screen">
      <Navbar />
      <SearchPatients />
    </div>
  );
}

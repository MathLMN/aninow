
import { Outlet } from "react-router-dom";
import { VetAuthGuard } from "@/components/vet/VetAuthGuard";
import { VetNavigation } from "./VetNavigation";

const VetLayout = () => {
  return (
    <VetAuthGuard>
      <div className="min-h-screen bg-gray-50">
        <VetNavigation />
        <main>
          <Outlet />
        </main>
      </div>
    </VetAuthGuard>
  );
};

export default VetLayout;

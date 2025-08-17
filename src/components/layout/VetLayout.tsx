
import { Outlet } from "react-router-dom";
import { VetAuthGuard } from "@/components/vet/VetAuthGuard";
import { VetNavigation } from "./VetNavigation";

const VetLayout = () => {
  return (
    <VetAuthGuard>
      <div className="min-h-screen bg-gray-50 font-poppins">
        <VetNavigation />
        <main className="pt-14 sm:pt-16 lg:pt-16">
          <div className="w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </VetAuthGuard>
  );
};

export default VetLayout;

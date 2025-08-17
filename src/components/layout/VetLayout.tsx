
import { Outlet } from "react-router-dom";
import { VetAuthGuard } from "@/components/vet/VetAuthGuard";
import { VetNavigation } from "./VetNavigation";

const VetLayout = () => {
  return (
    <VetAuthGuard>
      <div className="min-h-screen bg-gray-50 font-poppins">
        <VetNavigation />
        <main className="pt-16 px-2 sm:px-4 lg:px-6 xl:px-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </VetAuthGuard>
  );
};

export default VetLayout;

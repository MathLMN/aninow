
import { Outlet } from "react-router-dom";
import { VetAuthGuard } from "@/components/vet/VetAuthGuard";
import { VetNavigation } from "./VetNavigation";

const VetLayout = () => {
  return (
    <VetAuthGuard>
      <div className="min-h-screen bg-gray-50 font-poppins overflow-x-hidden">
        <VetNavigation />
        <main className="pt-14 sm:pt-16 lg:pt-16 px-1 sm:px-2 md:px-4 lg:px-6 xl:px-8 pb-4 sm:pb-6">
          <div className="max-w-full xl:max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </VetAuthGuard>
  );
};

export default VetLayout;

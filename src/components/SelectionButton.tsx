
import React from 'react';
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SelectionButtonProps {
  id: string;
  value: string;
  isSelected: boolean;
  onSelect: (value: string, selected: boolean) => void;
  children: React.ReactNode;
  className?: string;
  icon?: LucideIcon;
}

const SelectionButton: React.FC<SelectionButtonProps> = ({
  id,
  value,
  isSelected,
  onSelect,
  children,
  className,
  icon: Icon
}) => {
  const handleClick = () => {
    onSelect(value, !isSelected);
  };

  return (
    <button
      id={id}
      type="button"
      onClick={handleClick}
      className={cn(
        "flex items-center justify-center gap-2 p-2 border rounded-md transition-all duration-200 cursor-pointer text-left text-sm",
        isSelected 
          ? "bg-[#4D9380] text-white border-[#4D9380] shadow-md" 
          : "bg-white hover:bg-vet-beige/30 border-gray-300 hover:border-[#4D9380]/50",
        className
      )}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      <span>{children}</span>
    </button>
  );
};

export default SelectionButton;

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

const TableHeader = ({ column, title }) => {
  return (
    <div className="flex justify-start">
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="px-0"
      >
        {title}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

export default TableHeader;
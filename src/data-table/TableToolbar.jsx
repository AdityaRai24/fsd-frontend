import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save, PenSquare, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const TableToolbar = ({ 
  table, 
  editMode, 
  handleSaveChanges, 
  setEditMode 
}) => {
  return (
    <div className="flex items-center justify-between py-4">
      <Input
        placeholder="Filter by student name..."
        value={table.getColumn("studentName")?.getFilterValue() ?? ""}
        onChange={(event) =>
          table.getColumn("studentName")?.setFilterValue(event.target.value)
        }
        className="max-w-sm"
      />
      <div className="flex items-center gap-5">
        {editMode ? (
          <Button onClick={handleSaveChanges} className="bg-gray-700">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        ) : (
          <Button onClick={() => setEditMode(true)} className="bg-gray-700">
            <PenSquare className="mr-2 h-4 w-4" />
            Edit Mode
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TableToolbar;
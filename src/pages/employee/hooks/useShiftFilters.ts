
import { useState, useEffect } from "react";
import { ShiftDetails } from "../types/shift-types";

export const useShiftFilters = (shifts: ShiftDetails[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<[Date | undefined, Date | undefined]>([undefined, undefined]);
  const [filteredShifts, setFilteredShifts] = useState<ShiftDetails[]>([]);

  useEffect(() => {
    filterShifts();
  }, [shifts, searchQuery, dateRange]);

  const filterShifts = () => {
    let filtered = [...shifts];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(shift => 
        shift.eventTitle.toLowerCase().includes(query) ||
        shift.position.toLowerCase().includes(query) ||
        shift.location.toLowerCase().includes(query)
      );
    }

    if (dateRange[0] && dateRange[1]) {
      filtered = filtered.filter(shift => {
        const shiftDate = new Date(shift.date);
        return shiftDate >= dateRange[0]! && shiftDate <= dateRange[1]!;
      });
    }

    setFilteredShifts(filtered);
  };

  return {
    searchQuery,
    setSearchQuery,
    dateRange,
    setDateRange,
    filteredShifts
  };
};

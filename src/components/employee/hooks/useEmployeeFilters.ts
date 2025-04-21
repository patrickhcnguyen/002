import { useState, useCallback } from "react";
import { Employee } from "../types";
import { differenceInYears, parseISO, isWithinInterval } from "date-fns";

export function useEmployeeFilters(employees: Employee[]) {
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [ageRange, setAgeRange] = useState<{ min: number; max: number } | null>(null);
  const [appDownloaded, setAppDownloaded] = useState<boolean | null>(null);
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [ratingRange, setRatingRange] = useState<{ min: number; max: number } | null>(null);
  const [employmentStartDateRange, setEmploymentStartDateRange] = useState<{ start: string | null; end: string | null } | null>(null);
  const [selectedEmployeeType, setSelectedEmployeeType] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);

  const handleSort = useCallback((direction: 'asc' | 'desc') => {
    setSortDirection(direction);
  }, []);

  const handleFilterSelect = useCallback((field: string) => {
    setSelectedFilter(field === selectedFilter ? null : field);
    // Reset specific filters when changing filter type
    if (field !== 'age') setAgeRange(null);
    if (field !== 'downloadedApp') setAppDownloaded(null);
    if (field !== 'position') setSelectedPositions([]);
    if (field !== 'rating') setRatingRange(null);
    if (field !== 'employmentStartDate') setEmploymentStartDateRange(null);
    if (field !== 'employeeType') setSelectedEmployeeType(null);
    if (field !== 'gender') setSelectedGender(null);
  }, [selectedFilter]);

  const handleBranchSelect = useCallback((branchId: string) => {
    console.log('Selected branch:', branchId);
    setSelectedBranch(branchId === 'all-branches' ? null : branchId);
  }, []);

  const handlePositionFilterChange = useCallback((positions: string[]) => {
    console.log('Setting selected positions:', positions);
    setSelectedPositions(positions);
    setSelectedFilter('position');
  }, []);

  const handleAgeFilterChange = useCallback((minAge: number, maxAge: number) => {
    setAgeRange({ min: minAge, max: maxAge });
    setSelectedFilter('age');
  }, []);

  const handleAppDownloadedChange = useCallback((value: boolean | null) => {
    setAppDownloaded(value);
    setSelectedFilter('downloadedApp');
  }, []);

  const handleRatingFilterChange = useCallback((minRating: number, maxRating: number) => {
    setRatingRange({ min: minRating, max: maxRating });
    setSelectedFilter('rating');
  }, []);

  const handleEmploymentStartDateFilterChange = useCallback((startDate: string | null, endDate: string | null) => {
    setEmploymentStartDateRange(startDate || endDate ? { start: startDate, end: endDate } : null);
    setSelectedFilter('employmentStartDate');
  }, []);

  const handleEmployeeTypeFilterChange = useCallback((type: string | null) => {
    setSelectedEmployeeType(type);
    setSelectedFilter('employeeType');
  }, []);

  const handleGenderFilterChange = useCallback((gender: string | null) => {
    setSelectedGender(gender);
    setSelectedFilter('gender');
  }, []);

  const calculateAge = useCallback((birthDate: string) => {
    return differenceInYears(new Date(), parseISO(birthDate));
  }, []);

  const getSortedAndFilteredEmployees = useCallback(() => {
    console.log('Filtering employees...');
    let filteredEmployees = [...employees];

    // Apply branch filter
    if (selectedBranch) {
      filteredEmployees = filteredEmployees.filter(emp => {
        return emp.employee_branches?.some(eb => eb.branch_id === selectedBranch);
      });
    }

    // Apply position filter
    if (selectedPositions.length > 0) {
      filteredEmployees = filteredEmployees.filter(emp => {
        return emp.employee_branch_positions?.some(pos => 
          selectedPositions.includes(pos.branch_position_id)
        );
      });
    }

    // Apply gender filter
    if (selectedGender) {
      filteredEmployees = filteredEmployees.filter(emp => 
        emp.gender?.toLowerCase() === selectedGender.toLowerCase()
      );
    }

    // Apply age range filter
    if (ageRange) {
      filteredEmployees = filteredEmployees.filter(emp => {
        if (!emp.birthDate) return false;
        const age = calculateAge(emp.birthDate);
        return age >= ageRange.min && age <= ageRange.max;
      });
    }

    // Apply app downloaded filter
    if (appDownloaded !== null) {
      filteredEmployees = filteredEmployees.filter(emp => {
        const hasDownloadedApp = emp.downloadedApp === 'true';
        return hasDownloadedApp === appDownloaded;
      });
    }

    // Apply rating range filter
    if (ratingRange) {
      filteredEmployees = filteredEmployees.filter(emp => {
        const rating = emp.rating || 0;
        return rating >= ratingRange.min && rating <= ratingRange.max;
      });
    }

    // Apply employment start date filter
    if (employmentStartDateRange) {
      filteredEmployees = filteredEmployees.filter(emp => {
        if (!emp.employmentStartDate) return false;
        const startDate = parseISO(emp.employmentStartDate);
        
        if (employmentStartDateRange.start && employmentStartDateRange.end) {
          return isWithinInterval(startDate, {
            start: parseISO(employmentStartDateRange.start),
            end: parseISO(employmentStartDateRange.end)
          });
        } else if (employmentStartDateRange.start) {
          return startDate >= parseISO(employmentStartDateRange.start);
        } else if (employmentStartDateRange.end) {
          return startDate <= parseISO(employmentStartDateRange.end);
        }
        return true;
      });
    }

    // Apply employee type filter
    if (selectedEmployeeType) {
      filteredEmployees = filteredEmployees.filter(emp => 
        emp.employeeType === selectedEmployeeType
      );
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredEmployees = filteredEmployees.filter(emp => {
        const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
        const email = emp.email.toLowerCase();
        const phone = emp.phone?.toLowerCase() || '';
        return fullName.includes(query) || 
               email.includes(query) || 
               phone.includes(query);
      });
    }

    // Apply selected filter and sort
    if (selectedFilter) {
      filteredEmployees.sort((a, b) => {
        let valueA, valueB;

        switch (selectedFilter) {
          case 'gender':
            valueA = (a.gender || '').toLowerCase();
            valueB = (b.gender || '').toLowerCase();
            break;
          case 'name':
            valueA = `${a.firstName} ${a.lastName}`.toLowerCase();
            valueB = `${b.firstName} ${b.lastName}`.toLowerCase();
            break;
          case 'email':
            valueA = a.email.toLowerCase();
            valueB = b.email.toLowerCase();
            break;
          case 'phone':
            valueA = a.phone || '';
            valueB = b.phone || '';
            break;
          case 'department':
            valueA = a.department || '';
            valueB = b.department || '';
            break;
          case 'branch':
            valueA = (a.employee_branches?.[0]?.branches?.name || '').toLowerCase();
            valueB = (b.employee_branches?.[0]?.branches?.name || '').toLowerCase();
            break;
          case 'position':
            valueA = (a.employee_branch_positions?.[0]?.branch_positions?.title || '').toLowerCase();
            valueB = (b.employee_branch_positions?.[0]?.branch_positions?.title || '').toLowerCase();
            break;
          case 'createdAt':
            valueA = a.createdAt;
            valueB = b.createdAt;
            break;
          case 'lastActivity':
            valueA = a.lastActivity || '';
            valueB = b.lastActivity || '';
            break;
          default:
            valueA = (a.customFields?.[selectedFilter] || '').toString().toLowerCase();
            valueB = (b.customFields?.[selectedFilter] || '').toString().toLowerCase();
        }

        return sortDirection === 'asc' 
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      });
    }

    return filteredEmployees;
  }, [employees, selectedBranch, selectedPositions, ageRange, appDownloaded, ratingRange, 
      employmentStartDateRange, selectedEmployeeType, selectedGender, selectedFilter, 
      searchQuery, sortDirection, calculateAge]);

  return {
    sortDirection,
    selectedFilter,
    searchQuery,
    selectedBranch,
    handleSort,
    handleFilterSelect,
    handleBranchSelect,
    handlePositionFilterChange,
    setSearchQuery,
    handleAgeFilterChange,
    handleAppDownloadedChange,
    handleRatingFilterChange,
    handleEmploymentStartDateFilterChange,
    handleEmployeeTypeFilterChange,
    handleGenderFilterChange,
    getSortedAndFilteredEmployees,
  };
}

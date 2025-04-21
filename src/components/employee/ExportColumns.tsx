import { Employee } from "../employee/types";

export const exportColumns = [
  {
    header: "First Name",
    accessor: (employee: Employee) => employee.firstName || "",
  },
  {
    header: "Last Name",
    accessor: (employee: Employee) => employee.lastName || "",
  },
  {
    header: "Email",
    accessor: (employee: Employee) => employee.email || "",
  },
  {
    header: "Phone",
    accessor: (employee: Employee) => employee.phone || "",
  },
  {
    header: "Birth Date",
    accessor: (employee: Employee) => employee.birthDate || "",
  },
  {
    header: "Gender",
    accessor: (employee: Employee) => employee.gender || "",
  },
  {
    header: "Status",
    accessor: (employee: Employee) => employee.status || "",
  },
  {
    header: "Is Admin",
    accessor: (employee: Employee) => employee.isAdmin ? "Yes" : "No",
  },
  {
    header: "Is Active",
    accessor: (employee: Employee) => employee.isActive ? "Yes" : "No",
  },
  {
    header: "Created At",
    accessor: (employee: Employee) => employee.createdAt || "",
  },
  {
    header: "Updated At",
    accessor: (employee: Employee) => employee.updatedAt || "",
  },
  {
    header: "Last Activity",
    accessor: (employee: Employee) => employee.lastActivity || "",
  },
  {
    header: "Downloaded App",
    accessor: (employee: Employee) => employee.downloadedApp ? "Yes" : "No",
  },
  {
    header: "Notes",
    accessor: (employee: Employee) => employee.notes || "",
  },
  {
    header: "Branches",
    accessor: (employee: Employee) => {
      const branches = employee.employee_branches?.map(eb => eb.branches?.name);
      return branches ? branches.join(", ") : "";
    },
  },
  {
    header: "Positions",
    accessor: (employee: Employee) => {
      const positions = employee.employee_branch_positions?.map(ebp => ebp.branch_positions?.title);
      return positions ? positions.join(", ") : "";
    },
  },
  {
    header: "Custom Fields",
    accessor: (employee: Employee) => {
      if (!employee.customFields) return "";
      return Object.entries(employee.customFields)
        .map(([key, value]) => `${key}: ${value}`)
        .join("; ");
    },
  },
];
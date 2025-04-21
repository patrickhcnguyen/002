export const permissionGroups = [
  {
    title: "Employees",
    permissions: [
      "View employees",
      "Edit employee profile",
      "Permission to delete employees",
      "Permission to add and create employees"
    ]
  },
  {
    title: "Scheduling",
    permissions: [
      "View scheduling",
      "Perform scheduling actions"
    ]
  },
  {
    title: "Timesheet",
    permissions: [
      "View timesheets",
      "Approve timesheets"
    ]
  },
  {
    title: "Communication",
    permissions: [
      "View communication"
    ]
  },
  {
    title: "Reports",
    permissions: [
      "View reports"
    ]
  },
  {
    title: "CRM",
    permissions: [
      "View CRM",
      "Client billing"
    ]
  },
  {
    title: "Suppliers",
    permissions: [
      "View suppliers"
    ]
  },
  {
    title: "Finance",
    permissions: [
      "View payroll",
      "Allow to unlock payroll",
      "Export and process payroll",
      "Permission to see and create invoices"
    ]
  },
  {
    title: "Workflows",
    permissions: [
      "View workflows"
    ]
  },
  {
    title: "Compliance",
    permissions: [
      "View compliance"
    ]
  },
  {
    title: "Additional permissions",
    permissions: [
      "Owner (Edit permissions and system settings)",
      "Billing"
    ]
  }
];

export const adminTypes = [
  { value: "recruiter", label: "Recruiter" },
  { value: "branch_manager", label: "Branch Manager" },
  { value: "account_manager", label: "Account Manager" },
  { value: "admin", label: "Admin" }
];

export const getPermissionsForAdminType = (adminType: string) => {
  const allPermissions: Record<string, Record<string, boolean>> = {};
  
  permissionGroups.forEach(group => {
    allPermissions[group.title] = {};
    group.permissions.forEach(permission => {
      allPermissions[group.title][permission] = false;
    });
  });

  switch (adminType) {
    case "admin":
      // Set all permissions to true for admin
      permissionGroups.forEach(group => {
        group.permissions.forEach(permission => {
          allPermissions[group.title][permission] = true;
        });
      });
      break;
    case "recruiter":
      // Set only specific permissions for recruiter
      allPermissions["Employees"]["View employees"] = true;
      allPermissions["Employees"]["Edit employee profile"] = true;
      allPermissions["Employees"]["Permission to add and create employees"] = true;
      break;
    // Add cases for other admin types if needed
  }

  return allPermissions;
};
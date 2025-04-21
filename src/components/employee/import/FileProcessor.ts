import * as XLSX from 'xlsx';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const VALID_EMPLOYEE_TYPES = ['full_time', 'part_time', 'contract'];

const normalizeEmployeeType = (type: string): string => {
  const normalized = type.toLowerCase().replace(/\s+/g, '_');
  return VALID_EMPLOYEE_TYPES.includes(normalized) ? normalized : 'full_time';
};

export const processEmployeeData = async (
  rawData: any[],
  columnMapping: Record<string, string>
) => {
  try {
    console.log('Processing employee data:', { rawData, columnMapping });
    
    const processedEmployees = [];
    const skippedEmails = [];
    const invalidRows = [];
    
    // Process each row
    for (const row of rawData) {
      const employee: any = {
        status: 'candidate',
        is_active: true,
        employee_type: 'full_time', // Default value
      };
      
      // Map the columns according to the user's configuration
      Object.entries(columnMapping).forEach(([fileColumn, employeeField]) => {
        if (employeeField && employeeField !== "do_not_import") {
          // Convert field names to snake_case for database
          const dbField = employeeField
            .replace(/([A-Z])/g, '_$1')
            .toLowerCase()
            .replace(/^_/, '');
          
          // Special handling for employee_type
          if (dbField === 'employee_type' && row[fileColumn]) {
            employee[dbField] = normalizeEmployeeType(row[fileColumn]);
          } else {
            employee[dbField] = row[fileColumn] || null;
          }
        }
      });

      // Validate required fields
      const requiredFields = ['first_name', 'last_name', 'email'];
      const missingFields = requiredFields.filter(field => !employee[field]);

      if (missingFields.length > 0) {
        console.log(`Skipping row due to missing required fields: ${missingFields.join(', ')}`, employee);
        invalidRows.push({
          data: row,
          reason: `Missing required fields: ${missingFields.join(', ')}`
        });
        continue;
      }

      // Check if email already exists
      if (employee.email) {
        console.log('Checking for existing email:', employee.email);
        const { data: existingEmployees, error: checkError } = await supabase
          .from('employees')
          .select('email')
          .eq('email', employee.email);

        if (checkError) {
          console.error('Error checking email:', checkError);
          continue;
        }

        if (existingEmployees && existingEmployees.length > 0) {
          console.log(`Skipping duplicate email: ${employee.email}`);
          skippedEmails.push(employee.email);
          continue;
        }
      }

      processedEmployees.push(employee);
    }

    console.log('Processed employees:', processedEmployees);

    if (processedEmployees.length === 0) {
      if (invalidRows.length > 0) {
        toast.error(`No valid employees to import. ${invalidRows.length} rows had missing required fields.`);
      } else if (skippedEmails.length > 0) {
        toast.error(`No new employees to import. All ${skippedEmails.length} email(s) already exist.`);
      } else {
        toast.error('No valid employees to import');
      }
      return [];
    }

    // Insert valid employees into database
    const { data, error } = await supabase
      .from('employees')
      .insert(processedEmployees)
      .select();

    if (error) {
      console.error('Error inserting employees:', error);
      throw error;
    }

    // Show summary of results
    if (skippedEmails.length > 0) {
      toast.warning(`Skipped ${skippedEmails.length} duplicate email(s)`);
    }
    if (invalidRows.length > 0) {
      toast.warning(`Skipped ${invalidRows.length} invalid row(s)`);
    }
    
    console.log('Successfully imported employees:', data);
    toast.success(`Successfully imported ${data.length} employee(s)`);
    return data;
  } catch (error) {
    console.error('Error processing employees:', error);
    throw error;
  }
};

export const extractColumnsFromFile = (file: File): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    if (file.name.endsWith('.csv')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const headers = text.split('\n')[0].split(',').map(header => 
            header.trim().replace(/['"]+/g, '')
          );
          console.log("CSV Headers:", headers);
          resolve(headers);
        } catch (error) {
          console.error('Error processing CSV:', error);
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsText(file);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const headers = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0] as string[];
          console.log("Excel Headers:", headers);
          resolve(headers);
        } catch (error) {
          console.error('Error processing Excel:', error);
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsBinaryString(file);
    }
  });
};

export const processFile = async (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    if (file.name.endsWith('.csv')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const rows = text.split('\n').slice(1); // Skip header row
          const headers = text.split('\n')[0].split(',').map(h => h.trim().replace(/['"]+/g, ''));
          
          const data = rows
            .filter(row => row.trim()) // Filter out empty rows
            .map(row => {
              const values = row.split(',').map(val => val.trim().replace(/['"]+/g, ''));
              return headers.reduce((obj, header, index) => {
                obj[header] = values[index] || null; // Handle missing values
                return obj;
              }, {} as any);
            });
          
          resolve(data);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsText(file);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    }
  });
};
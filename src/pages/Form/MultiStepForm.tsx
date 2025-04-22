import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './styles.css'; 
import supabase from '@/lib/supabaseClient'; 


const MultiStepForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [formData, setFormData] = useState<any>({});
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const staffRequirementsRef = useRef<HTMLDivElement>(null);
  const [showThankYou, setShowThankYou] = useState(false);

  const positionImages = {
    "Brand Ambassadors": "https://images.squarespace-cdn.com/content/65d3c0aefe9b024b40b6fa20/f1f125a8-db1a-40ad-aa6c-0460c4e521f5/F864B7BE-D5ED-4F06-8D41-991BDBE0D5FD.jpg",
    "Bartenders": "https://images.squarespace-cdn.com/content/65d3c0aefe9b024b40b6fa20/aab8a440-7624-4851-852e-56010bf8c40a/818E85D3-0507-401F-9C56-64EBB2420930_4_5005_c.jpeg",
    "Production Assistants": "https://images.squarespace-cdn.com/content/65d3c0aefe9b024b40b6fa20/a7745cd3-de4a-4869-8a07-fbc780097b81/IMG_1915.jpeg",
    "Catering Staff": "https://images.squarespace-cdn.com/content/65d3c0aefe9b024b40b6fa20/9ac51559-94cb-4df8-b304-6292023d427f/AFB61D4E-AA65-4D17-8F34-4E50050F9725_4_5005_c.jpeg",
    "Model Staff": "https://images.squarespace-cdn.com/content/65d3c0aefe9b024b40b6fa20/33f2610c-f979-41e2-98a8-b33c30ca4b9b/DA2CD34A-A52D-4C98-890F-5058246CB6F6.JPG",
    "Registration Staff": "https://images.squarespace-cdn.com/content/65d3c0aefe9b024b40b6fa20/89999afb-dde9-4592-86f6-b0f285742d3c/5BD59C48-F696-42A8-B1F3-AB8324BD1A9E.jpg",
    "Convention Staff": "https://images.squarespace-cdn.com/content/65d3c0aefe9b024b40b6fa20/1b99adb3-76f3-41b0-a01c-c24c5f14439e/12013A5A-50C6-48B0-98F3-076623A5A98C_4_5005_c.jpeg",
  } as const;

  const positions = Object.keys(positionImages);

  useEffect(() => {
    if (currentStep === 3) {
      // should fix this to be multiple headers/rows instead of one text box 
      if (selectedDates.length > 1) {
        if (staffRequirementsRef.current) {
          staffRequirementsRef.current.innerHTML = `
            <label for="eventDetails">Provide your staffing plan for your multi day event</label>
            <textarea 
              id="eventDetails" 
              name="eventDetails" 
              class="w-full p-3 border rounded-md min-h-[120px]"
              required 
              placeholder="Example:
              09/14/2024 - 10 Convention Staff from 10 am - 6 pm
              09/15/2024 - 8 Convention Staff from 8 am - 4 pm
              09/16/2024 - 15 Convention Staff from 2 pm - 10 pm"></textarea>
            <div id="eventDetailsError" class="error-message"></div>
          `;
        }
      } else {
        populateStaffRequirements();
      }
    }
  }, [currentStep, selectedDates, selectedPositions]);

  const handleSelectPosition = (position: string) => {
    setSelectedPositions((prev) =>
      prev.includes(position)
        ? prev.filter((p) => p !== position)
        : [...prev, position]
    );
  };

  const nextStep = (step: number) => {
    if (step === 1 && selectedPositions.length === 0) {
      alert('Please select at least one position.');
      return;
    }

    if (step === 3 && !validateStaffRequirements()) {
      return;
    }

    setCurrentStep(step + 1);
  };

  const prevStep = (step: number) => {
    setCurrentStep(step - 1);
  };

  const updateProgress = () => {
    return `${25 * currentStep}%`;
  };

  const validateStaffRequirements = () => {
    const inputs = document.querySelectorAll('#staffRequirements input');
    for (let i = 0; i < inputs.length; i++) {
      if (!(inputs[i] as HTMLInputElement).value) {
        alert('Please fill in all staff requirements.');
        return false;
      }
    }
    return true;
  };

  const populateStaffRequirements = () => {
    if (staffRequirementsRef.current && selectedPositions.length > 0) {
      staffRequirementsRef.current.innerHTML = '';
      selectedPositions.forEach((position) => {
        const positionDiv = document.createElement('div');
        positionDiv.className = 'staff-requirement';
        positionDiv.innerHTML = `
          <p>${position}</p>
          <div class="staff-requirement-row">
            <div>
              <label for="${position}-count">How many ${position} needed:</label>
              <input 
                type="number" 
                id="${position}-count"
                name="${position}-count" 
                class="w-full p-2 border rounded-md"
                required 
              />
            </div>
            <div>
              <label for="${position}-hours">Hours per shift:</label>
              <input 
                type="number" 
                id="${position}-hours"
                name="${position}-hours" 
                class="w-full p-2 border rounded-md"
                required 
              />
            </div>
          </div>
        `;
        staffRequirementsRef.current.appendChild(positionDiv);
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Get staff requirements based on whether it's a multi-day or single-day event
    const staffRequirements = selectedDates.length > 1
      ? (document.getElementById('eventDetails') as HTMLTextAreaElement)?.value
      : Array.from(document.querySelectorAll('#staffRequirements .staff-requirement'))
          .map(div => {
            const position = (div as HTMLElement).querySelector('p')?.textContent || '';
            const count = (div.querySelector(`[name="${position}-count"]`) as HTMLInputElement)?.value;
            const hours = (div.querySelector(`[name="${position}-hours"]`) as HTMLInputElement)?.value;
            return {
              position,
              count: parseInt(count),
              hours: parseInt(hours)
            };
          });

    // Format dates in mm-dd-yyyy format
    const formattedDates = selectedDates.map(date => {
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${month}-${day}-${year}`;
    });

    const payload = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone_number: formData.phoneNumber,
      type_of_staff: selectedPositions, // Using selectedPositions directly instead of formData.selectedPositions
      type_of_event: formData.eventType,
      event_location: formData.location,
      event_date: formattedDates, // Array of formatted dates
      staff_requirements: staffRequirements, // Will be either array of requirements or text for multi-day
      created_at: new Date().toISOString()
    };

    try {
      const { error } = await supabase
        .from('Requests')
        .insert([payload]);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Form submitted successfully');
      setShowThankYou(true);
      setTimeout(() => {
        resetForm();
        setShowThankYou(false);
      }, 3000);
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while submitting the form.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedPositions([]);
    setFormData({});
    setSelectedDates([]);
    setCurrentStep(1);
  };

  return (
    <div className="multi-step-form-container">
      <div id="multi-step-form">
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: updateProgress() }}></div>
          <div className={`progress-step ${currentStep === 4 ? 'complete' : ''}`}>Inquire</div>
        </div>
        <form id="form" onSubmit={handleSubmit}>
          {/* Step 1 */}
          {currentStep === 1 && (
            <div className="form-step active">
              <h2>What type of staff are you looking for?</h2>
              <p className="select-instruction">Select all that apply:</p>
              <div className="position-grid">
                {positions.map((position) => (
                  <div
                    key={position}
                    className={`position-item ${selectedPositions.includes(position) ? 'selected' : ''}`}
                    onClick={() => handleSelectPosition(position)}
                    data-position={position}
                  >
                    <img src={positionImages[position]} alt={position} />
                    <div className="overlay">{position}</div>
                  </div>
                ))}
              </div>
              <input type="hidden" name="selectedPositions" value={JSON.stringify(selectedPositions)} />
              <button type="button" onClick={() => nextStep(1)}>Next</button>
            </div>
          )}

          {/* Step 2 */}
          {currentStep === 2 && (
            <div className="form-step active">
              <h2>Event Information</h2>
              <div className="date-picker-container">
                <label>Event Date(s):</label>
                <DatePicker
                  selected={dateRange[0]}
                  onChange={(dates) => {
                    const [start, end] = dates as [Date, Date];
                    setDateRange([start, end]);
                    
                    if (start && end) {
                      const dateArray: Date[] = [];
                      let currentDate = new Date(start);
                      
                      while (currentDate <= end) {
                        dateArray.push(new Date(currentDate));
                        currentDate.setDate(currentDate.getDate() + 1);
                      }
                      setSelectedDates(dateArray);
                    } else {
                      setSelectedDates(start ? [start] : []);
                    }
                  }}
                  startDate={dateRange[0]}
                  endDate={dateRange[1]}
                  selectsRange
                  minDate={new Date()}
                  placeholderText="Select event date range"
                  className="date-picker-input"
                  calendarClassName="date-picker-calendar"
                  wrapperClassName="date-picker-wrapper"
                />
              </div>
              <label>What kind of event is this?</label>
              <input
                type="text"
                name="eventType"
                value={formData.eventType || ''}
                onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                placeholder="e.g., Wedding, Corporate Event, Trade Show"
              />
              <label>Where is your event located?</label>
              <input
                type="text"
                name="location"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Enter event location"
              />
              <div className="button-group">
                <button type="button" onClick={() => prevStep(2)}>Back</button>
                <button type="button" onClick={() => nextStep(2)}>Next</button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {currentStep === 3 && (
            <div className="form-step active">
              <h2>Staff Requirements</h2>
              <div id="staffRequirements" ref={staffRequirementsRef}></div>
              <div id="scrollIndicator">Scroll for more options</div>
              <div className="button-group">
                <button type="button" onClick={() => prevStep(3)}>Back</button>
                <button type="button" onClick={() => nextStep(3)}>Next</button>
              </div>
            </div>
          )}

          {/* Step 4 */}
          {currentStep === 4 && (
            <div className="form-step active">
              <h2>Contact Information</h2>
              <label>First name:</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName || ''}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
              <label>Last name:</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName || ''}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <label>Phone Number:</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber || ''}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                required
              />
              <div className="button-group">
                <button type="button" onClick={() => prevStep(4)}>Back</button>
                <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit'}</button>
              </div>
            </div>
          )}
        </form>
      </div>

      {showThankYou && (
        <div id="thankYouPopup" className="popup" style={{ display: 'block' }}>
          <div className="popup-content">
            <h2>Thank you for your submission!</h2>
            <p>Our Team will contact you regarding your staffing needs momentarily.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiStepForm;

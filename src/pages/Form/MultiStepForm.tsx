import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './styles.css'; // <- Import your original CSS here


const MultiStepForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [formData, setFormData] = useState<any>({});
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const staffRequirementsRef = useRef<HTMLDivElement>(null);
  const [showThankYou, setShowThankYou] = useState(false);

  useEffect(() => {
    if (currentStep === 3) {
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
        const div = document.createElement('div');
        div.className = 'staff-requirement';
        div.innerHTML = `
          <p>${position}</p>
          <div class="staff-requirement-row">
            <div>
              <label>How many ${position} needed:</label>
              <input 
                type="number" 
                name="${position}-count" 
                class="w-full p-2 border rounded-md"
                required 
              />
            </div>
            <div>
              <label>Hours per shift:</label>
              <input 
                type="number" 
                name="${position}-hours" 
                class="w-full p-2 border rounded-md"
                required 
              />
            </div>
          </div>
        `;
        staffRequirementsRef.current.appendChild(div);
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const payload: any = {
      ...formData,
      selectedPositions,
      eventDates: selectedDates.map(
        (d) => `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`
      ).join(', '),
    };

    fetch('ENTER SCRIPT URL HERE', {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(() => {
        console.log('Form submitted successfully');
        setShowThankYou(true);
        setTimeout(() => {
          resetForm();
          setShowThankYou(false);
        }, 3000);
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('An error occurred while submitting the form.');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
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
                {["Brand Ambassadors", "Bartenders", "Production Assistants", "Catering Staff", "Model Staff", "Registration Staff", "Convention Staff", "Line Cooks"].map((position) => (
                  <div
                    key={position}
                    className={`position-item ${selectedPositions.includes(position) ? 'selected' : ''}`}
                    onClick={() => handleSelectPosition(position)}
                  >
                    <img src={`/images/${position.replaceAll(' ', '_')}.jpg`} alt={position} />
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

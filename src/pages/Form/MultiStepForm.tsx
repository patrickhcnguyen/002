import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './styles.css'; 
import supabase from '@/lib/supabaseClient'; 
import { formatDate } from 'date-fns';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { geocodeAndFindNearestOffice } from './locationService';


interface StaffRequirement {
  date: string;
  position: string;
  count: number;
  startTime: string;
  endTime: string;
}

interface StaffInput {
  position: string;
  count: string;
  startTime: string;
  endTime: string;
}

interface DateStaffInputs {
  [date: string]: Record<string, StaffInput>;
}

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const MultiStepForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [formData, setFormData] = useState<any>({});
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const staffRequirementsRef = useRef<HTMLDivElement>(null);
  const [showThankYou, setShowThankYou] = useState(false);
  const [staffInputs, setStaffInputs] = useState<DateStaffInputs>({});

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

  useEffect(() => {
    if (currentStep === 2) {
      const geocoder = new MapboxGeocoder({
        accessToken: MAPBOX_TOKEN || '',
        types: 'address,place',
        placeholder: 'Enter event location',
        marker: false
      });

      const container = document.getElementById('geocoder-container');
      if (container) {
        container.innerHTML = '';
        geocoder.addTo('#geocoder-container');
      }

      geocoder.on('result', async (e) => {
        try {
          const location = await geocodeAndFindNearestOffice(e.result.place_name);
          setFormData(prev => ({
            ...prev,
            location: location.placeName,
            coordinates: location.coordinates,
            nearestOffice: location.nearestOffice
          }));
        } catch (error) {
          console.error('Error processing location:', error);
          alert('Error processing location. Please try again.');
        }
      });

      return () => {
        const container = document.getElementById('geocoder-container');
        if (container) {
          container.innerHTML = '';
        }
      };
    }
  }, [currentStep]);

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
        const safePosition = position.replace(/\s+/g, '-'); 
        const positionDiv = document.createElement('div');
        positionDiv.className = 'staff-requirement mb-6';
        positionDiv.setAttribute('data-position', position);
        positionDiv.innerHTML = `
          <p class="font-medium mb-2">${position}</p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label for="${safePosition}-count">Number of Staff:</label>
              <input 
                type="number" 
                id="${safePosition}-count"
                name="${safePosition}-count" 
                class="w-full p-2 border rounded-md"
                min="1"
                required 
              />
            </div>
            <div>
              <label for="${safePosition}-start">Start Time:</label>
              <input 
                type="time" 
                id="${safePosition}-start"
                name="${safePosition}-start" 
                class="w-full p-2 border rounded-md"
                required 
              />
            </div>
            <div>
              <label for="${safePosition}-end">End Time:</label>
              <input 
                type="time" 
                id="${safePosition}-end"
                name="${safePosition}-end" 
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

  const renderStaffRequirements = () => {
    return selectedDates.map(date => {
      const displayDate = formatDate(date, 'MMMM d, yyyy');
      const formattedDate = formatDate(date, 'yyyy-MM-dd');
      return (
        <div key={formattedDate} className="mb-8">
          <h3 className="text-lg font-semibold mb-4">
            {displayDate}
          </h3>
          <div className="space-y-6">
            {selectedPositions.map((position) => {
              const safePosition = position.replace(/\s+/g, '-');
              return (
                <div key={`${formattedDate}-${position}`} className="staff-requirement mb-6">
                  <p className="font-medium mb-2">{position}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor={`${formattedDate}-${safePosition}-count`}>Number of Staff:</label>
                      <input 
                        type="number" 
                        id={`${formattedDate}-${safePosition}-count`}
                        value={staffInputs[formattedDate]?.[position]?.count || ''}
                        onChange={(e) => handleStaffInputChange(formattedDate, position, 'count', e.target.value)}
                        className="w-full p-2 border rounded-md"
                        min="1"
                        required 
                      />
                    </div>
                    <div>
                      <label htmlFor={`${formattedDate}-${safePosition}-start`}>Start Time:</label>
                      <input 
                        type="time" 
                        id={`${formattedDate}-${safePosition}-start`}
                        value={staffInputs[formattedDate]?.[position]?.startTime || ''}
                        onChange={(e) => handleStaffInputChange(formattedDate, position, 'startTime', e.target.value)}
                        className="w-full p-2 border rounded-md"
                        required 
                      />
                    </div>
                    <div>
                      <label htmlFor={`${formattedDate}-${safePosition}-end`}>End Time:</label>
                      <input 
                        type="time" 
                        id={`${formattedDate}-${safePosition}-end`}
                        value={staffInputs[formattedDate]?.[position]?.endTime || ''}
                        onChange={(e) => handleStaffInputChange(formattedDate, position, 'endTime', e.target.value)}
                        className="w-full p-2 border rounded-md"
                        required 
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    });
  };

  const handleStaffInputChange = (date: string, position: string, field: keyof StaffInput, value: string) => {
    setStaffInputs(prev => ({
      ...prev,
      [date]: {
        ...prev[date],
        [position]: {
          ...prev[date]?.[position],
          position,
          [field]: value
        }
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    const staffRequirements: StaffRequirement[] = selectedDates.flatMap(date => {
      const formattedDate = formatDate(date, 'yyyy-MM-dd');
      return selectedPositions
        .map(position => {
          const input = staffInputs[formattedDate]?.[position];
          if (!input) return null;
          
          return {
            date: formattedDate,
            position: position,
            count: parseInt(input.count || '0'),
            startTime: input.startTime,
            endTime: input.endTime
          };
        })
        .filter((req): req is StaffRequirement => 
          req !== null && req.count > 0 && req.startTime !== '' && req.endTime !== ''
        );
    });

    console.log('Staff Requirements:', staffRequirements);

    const payload = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone_number: formData.phoneNumber,
      type_of_staff: selectedPositions,
      type_of_event: formData.eventType,
      event_location: formData.location,
      closest_branch: formData.nearestOffice?.name,
      event_date: selectedDates[0] ? selectedDates[0].toISOString().split('T')[0] : null,
      staff_requirements: staffRequirements,
      created_at: new Date().toISOString()
    };
    console.log(payload);

    if (staffRequirements.length === 0) {
      alert('Please add staff requirements');
      setIsSubmitting(false);
      return;
    }

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
    setStaffInputs({});
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
                  popperProps={{
                    strategy: "fixed"
                  }}
                  popperPlacement="bottom-start"
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
              <div 
                id="geocoder-container" 
                className="geocoder-container"
                style={{ position: 'relative' }}
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
              <div id="staffRequirements">
                {renderStaffRequirements()}
              </div>
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

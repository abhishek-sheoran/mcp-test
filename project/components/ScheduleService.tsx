'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import {
  Car,
  MapPin,
  Wrench,
  Truck,
  Calendar as CalendarIcon,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { Vehicle, Service, TransportOption, AppointmentData, TimeSlot } from '@/types';
import { mockUser, mockDealerships } from '@/types/mock-data';

// Simulated API call for fetching vehicles
const fetchVehicles = async (): Promise<Vehicle[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockUser.vehicles);
    }, 2000); // Simulate 2 second API delay
  });
};

// Simulated API call for fetching available services
const fetchServices = async (): Promise<Service[]> => {
  // TODO: Fetch operations that myKaarma has to offer at this dealership via API Call to their endpoint.
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: '1', name: 'Engine Oil Service', description: 'Complete oil change and filter replacement' },
        { id: '2', name: 'Tire Rotation and Balance', description: 'Rotate tires and check balance' },
        { id: '3', name: 'Brake System Inspection', description: 'Comprehensive brake system check' },
        { id: '4', name: 'Diagnostic Check', description: 'Computer diagnostic scan' },
        { id: '5', name: 'Battery Test', description: 'Battery health and charging system test' },
        { id: '6', name: 'Air Filter Replacement', description: 'Replace engine air filter' },
        { id: '7', name: 'Transmission Service', description: 'Transmission fluid change and inspection' },
        { id: '8', name: 'Coolant System Service', description: 'Coolant flush and system check' },
        { id: '9', name: 'Spark Plug Replacement', description: 'Replace worn spark plugs' },
        { id: '10', name: 'Cabin Air Filter', description: 'Replace cabin air filter for clean air' },
      ]);
    }, 1500); // Simulate 1.5 second API delay
  });
};

// Simulated API call to verify if customer is registered
const verifyCustomer = async (userEmail: string): Promise<{ isRegistered: boolean; customerId?: string }> => {
  // TODO: Replace with actual API call to check if valid customer exists in myKaarma with matching email.
  const response = await fetch(`https://srishti79.mykaarma.com/department//verify`);
  // Example: const response = await fetch(`/api/customer/verify?email=${userEmail}`);
  // return response.json();
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate that 70% of users are already registered
      const isRegistered = Math.random() > 0.3;
      resolve({
        isRegistered,
        customerId: isRegistered ? `CUST_${Date.now()}` : undefined
      });
    }, 1000); // Simulate 1 second API delay
  });
};

// Simulated API call to register customer at dealership
const registerCustomer = async (userEmail: string, dealershipId: string): Promise<{ success: boolean; customerId: string }> => {
  // TODO: Replace with actual API call to register customer
  // Example: const response = await fetch('/api/customer/register', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ email: userEmail, dealershipId })
  // });
  // return response.json();
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        customerId: `CUST_${Date.now()}`
      });
    }, 1500); // Simulate 1.5 second API delay
  });
};

// Simulated API call for fetching transport options
const fetchTransportOptions = async (): Promise<TransportOption[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          name: 'Wait at Dealership',
          description: 'Stay at our comfortable lounge with complimentary refreshments and Wi-Fi'
        },
        {
          id: '2',
          name: 'Drop Off & Pick Up',
          description: 'Leave your vehicle with us and arrange for pickup when service is complete'
        },
        {
          id: '3',
          name: 'Courtesy Vehicle',
          description: 'Use one of our courtesy vehicles while your car is being serviced'
        },
        {
          id: '4',
          name: 'Shuttle Service',
          description: 'Take advantage of our complimentary shuttle service within 5 miles'
        }
      ]);
    }, 1500); // Simulate 1.5 second API delay
  });
};

// Simulated API call for fetching available time slots
const fetchTimeSlots = async (date: Date): Promise<TimeSlot[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: '1', time: '9:00 AM', available: true },
        { id: '2', time: '10:00 AM', available: true },
        { id: '3', time: '11:00 AM', available: false },
        { id: '4', time: '1:00 PM', available: true },
        { id: '5', time: '2:00 PM', available: true },
        { id: '6', time: '3:00 PM', available: false },
        { id: '7', time: '4:00 PM', available: true },
        { id: '8', time: '5:00 PM', available: true },
      ]);
    }, 1000); // Simulate 1 second API delay
  });
};

// Simulated API call for booking the appointment
const bookAppointment = async (appointmentData: AppointmentData): Promise<{ success: boolean; appointmentId: string }> => {
  // TODO: Replace with actual API call to book appointment
  // Example: const response = await fetch('/api/appointments', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(appointmentData)
  // });
  // return response.json();
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        appointmentId: `APT_${Date.now()}`
      });
    }, 2000); // Simulate 2 second API delay
  });
};

interface ScheduleServiceProps {
  userEmail?: string; // Add user email prop to access logged-in user
}

export default function ScheduleService({ userEmail = 'user@example.com' }: ScheduleServiceProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [appointmentData, setAppointmentData] = useState<AppointmentData>({
    services: [],
  });
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [transportOptions, setTransportOptions] = useState<TransportOption[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [isLoadingTransport, setIsLoadingTransport] = useState(false);
  const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState(false);
  const [isBookingAppointment, setIsBookingAppointment] = useState(false);
  const [isProcessingNext, setIsProcessingNext] = useState(false);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [appointmentId, setAppointmentId] = useState<string | null>(null);

  const steps = [
    { number: 1, title: 'Select Vehicle', icon: Car },
    { number: 2, title: 'Select Dealership', icon: MapPin },
    { number: 3, title: 'Select Services', icon: Wrench },
    { number: 4, title: 'Transport Option', icon: Truck },
    { number: 5, title: 'Date & Time', icon: CalendarIcon },
    { number: 6, title: 'Confirmation', icon: CheckCircle },
  ];

  // Load vehicles when component mounts or when returning to step 1
  useEffect(() => {
    if (currentStep === 1 && vehicles.length === 0) {
      setIsLoadingVehicles(true);
      fetchVehicles()
        .then((fetchedVehicles) => {
          setVehicles(fetchedVehicles);
        })
        .catch((error) => {
          console.error('Failed to fetch vehicles:', error);
          // TODO: Handle error state - show error message to user
        })
        .finally(() => {
          setIsLoadingVehicles(false);
        });
    }
  }, [currentStep, vehicles.length]);

  // Load services when reaching step 3
  useEffect(() => {
    if (currentStep === 3 && services.length === 0) {
      setIsLoadingServices(true);
      fetchServices()
        .then((fetchedServices) => {
          setServices(fetchedServices);
        })
        .catch((error) => {
          console.error('Failed to fetch services:', error);
          // TODO: Handle error state - show error message to user
        })
        .finally(() => {
          setIsLoadingServices(false);
        });
    }
  }, [currentStep, services.length]);

  // Load transport options when reaching step 4
  useEffect(() => {
    if (currentStep === 4 && transportOptions.length === 0) {
      setIsLoadingTransport(true);
      fetchTransportOptions()
        .then((fetchedOptions) => {
          setTransportOptions(fetchedOptions);
        })
        .catch((error) => {
          console.error('Failed to fetch transport options:', error);
          // TODO: Handle error state - show error message to user
        })
        .finally(() => {
          setIsLoadingTransport(false);
        });
    }
  }, [currentStep, transportOptions.length]);

  // Load time slots when date is selected
  useEffect(() => {
    if (selectedDate) {
      setIsLoadingTimeSlots(true);
      setTimeSlots([]); // Clear existing time slots
      setAppointmentData(prev => ({ ...prev, timeSlot: undefined })); // Clear selected time slot
      
      fetchTimeSlots(selectedDate)
        .then((fetchedSlots) => {
          setTimeSlots(fetchedSlots);
        })
        .catch((error) => {
          console.error('Failed to fetch time slots:', error);
          // TODO: Handle error state - show error message to user
        })
        .finally(() => {
          setIsLoadingTimeSlots(false);
        });
    }
  }, [selectedDate]);

  const canProceed = () => {
    switch (currentStep) {
      case 1: return !!appointmentData.vehicle && !isLoadingVehicles;
      case 2: return !!appointmentData.dealership;
      case 3: return !isLoadingServices; // Can proceed with no services selected
      case 4: return !!appointmentData.transportOption;
      case 5: return !!(selectedDate && appointmentData.timeSlot);
      default: return false;
    }
  };

  const handleNextStep = async () => {
    if (!canProceed() || isProcessingNext) return;

    // Special handling for step 5 - book appointment when moving to confirmation
    if (currentStep === 5) {
      setIsProcessingNext(true);
      setIsBookingAppointment(true);
      
      try {
        const bookingResult = await bookAppointment(appointmentData);
        
        if (bookingResult.success) {
          console.log('Appointment booked successfully:', bookingResult.appointmentId);
          setAppointmentId(bookingResult.appointmentId);
          setCurrentStep(currentStep + 1);
        } else {
          console.error('Failed to book appointment');
          // TODO: Show error message to user
        }
        
      } catch (error) {
        console.error('Failed to book appointment:', error);
        // TODO: Show error message to user
      } finally {
        setIsProcessingNext(false);
        setIsBookingAppointment(false);
      }
    }
    // Special handling for step 1 - verify/register customer when moving from vehicle selection
    else if (currentStep === 1) {
      setIsProcessingNext(true);
      
      try {
        // Step 1: Verify if customer is registered
        console.log('Verifying customer registration...');
        const verificationResult = await verifyCustomer(userEmail);
        
        if (verificationResult.isRegistered) {
          console.log('Customer is already registered:', verificationResult.customerId);
          setCustomerId(verificationResult.customerId!);
        } else {
          console.log('Customer not registered, proceeding to register...');
          
          // Step 2: Register customer if not already registered
          // Note: We'll register at the selected dealership once they choose one
          // For now, we'll mark them as needing registration
          setCustomerId(null);
        }
        
        // Proceed to next step
        setCurrentStep(currentStep + 1);
        
      } catch (error) {
        console.error('Failed to verify/register customer:', error);
        // TODO: Show error message to user
        // For now, we'll still allow them to proceed
        setCurrentStep(currentStep + 1);
      } finally {
        setIsProcessingNext(false);
      }
    } 
    // Special handling for step 2 - register customer at selected dealership if needed
    else if (currentStep === 2 && !customerId) {
      setIsProcessingNext(true);
      
      try {
        console.log('Registering customer at dealership...');
        const registrationResult = await registerCustomer(userEmail, appointmentData.dealership!.id);
        
        if (registrationResult.success) {
          console.log('Customer successfully registered:', registrationResult.customerId);
          setCustomerId(registrationResult.customerId);
        } else {
          console.error('Failed to register customer');
          // TODO: Show error message to user
        }
        
        // Proceed to next step
        setCurrentStep(currentStep + 1);
        
      } catch (error) {
        console.error('Failed to register customer:', error);
        // TODO: Show error message to user
        // For now, we'll still allow them to proceed
        setCurrentStep(currentStep + 1);
      } finally {
        setIsProcessingNext(false);
      }
    } 
    // Regular step progression for other steps
    else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleServiceToggle = (service: Service, checked: boolean) => {
    if (checked) {
      setAppointmentData({
        ...appointmentData,
        services: [...appointmentData.services, service],
      });
    } else {
      setAppointmentData({
        ...appointmentData,
        services: appointmentData.services.filter(s => s.id !== service.id),
      });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Select Your Vehicle</h2>
              <p className="text-slate-600">Please choose the BMW vehicle you wish to get serviced.</p>
            </div>
            
            {isLoadingVehicles ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-[#1C69D4]" />
                <p className="text-slate-600">Loading your BMW vehicles... </p>
              </div>
            ) : (
              <div className="space-y-4">
                {vehicles.map((vehicle) => (
                  <Card 
                    key={vehicle.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      appointmentData.vehicle?.id === vehicle.id 
                        ? 'border-[#1C69D4] bg-blue-50' 
                        : 'border-slate-200'
                    }`}
                    onClick={() => setAppointmentData({ ...appointmentData, vehicle })}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                            <Car className="w-6 h-6 text-slate-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900">{vehicle.model}</h3>
                            <p className="text-sm text-slate-600">Year: {vehicle.year}</p>
                            <p className="text-xs text-slate-500">VIN: {vehicle.vin.slice(-7)}</p>
                          </div>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 ${
                          appointmentData.vehicle?.id === vehicle.id
                            ? 'bg-[#1C69D4] border-[#1C69D4]'
                            : 'border-slate-300'
                        }`}>
                          {appointmentData.vehicle?.id === vehicle.id && (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Select Your Dealership</h2>
              <p className="text-slate-600">Where would you like to have your service performed?</p>
            </div>
            <div className="space-y-4">
              {mockDealerships.map((dealership) => (
                <Card 
                  key={dealership.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    appointmentData.dealership?.id === dealership.id 
                      ? 'border-[#1C69D4] bg-blue-50' 
                      : 'border-slate-200'
                  }`}
                  onClick={() => setAppointmentData({ ...appointmentData, dealership })}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                          <MapPin className="w-6 h-6 text-slate-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">{dealership.name}</h3>
                          <p className="text-sm text-slate-600">{dealership.address}</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 ${
                        appointmentData.dealership?.id === dealership.id
                          ? 'bg-[#1C69D4] border-[#1C69D4]'
                          : 'border-slate-300'
                      }`}>
                        {appointmentData.dealership?.id === dealership.id && (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Select Services</h2>
              <p className="text-slate-600">Choose the services your vehicle needs.</p>
            </div>
            
            {isLoadingServices ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-[#1C69D4]" />
                <p className="text-slate-600">Loading available services...</p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {services.map((service) => (
                    <Card key={service.id} className="border-slate-200">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <Checkbox
                            id={service.id}
                            checked={appointmentData.services.some(s => s.id === service.id)}
                            onCheckedChange={(checked) => handleServiceToggle(service, checked as boolean)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <Label htmlFor={service.id} className="text-base font-medium text-slate-900 cursor-pointer">
                              {service.name}
                            </Label>
                            <p className="text-sm text-slate-600 mt-1">{service.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {appointmentData.services.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Selected Services:</h4>
                    <div className="flex flex-wrap gap-2">
                      {appointmentData.services.map((service) => (
                        <Badge key={service.id} variant="secondary" className="bg-blue-100 text-blue-800">
                          {service.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Select Transport Option</h2>
              <p className="text-slate-600">How will you manage your mobility during the service?</p>
            </div>
            
            {isLoadingTransport ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-[#1C69D4]" />
                <p className="text-slate-600">Loading transport options...</p>
              </div>
            ) : (
              <RadioGroup
                value={appointmentData.transportOption?.id}
                onValueChange={(value) => {
                  const option = transportOptions.find(o => o.id === value);
                  setAppointmentData({ ...appointmentData, transportOption: option });
                }}
                className="space-y-4"
              >
                {transportOptions.map((option) => (
                  <Card key={option.id} className="border-slate-200">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <RadioGroupItem value={option.id} id={option.id} />
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                            <Truck className="w-6 h-6 text-slate-600" />
                          </div>
                          <div>
                            <Label htmlFor={option.id} className="text-base font-medium text-slate-900 cursor-pointer">
                              {option.name}
                            </Label>
                            <p className="text-sm text-slate-600 mt-1">{option.description}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </RadioGroup>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Select Date & Time</h2>
              <p className="text-slate-600">Choose a convenient date and time for your appointment.</p>
            </div>
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Select Date</h3>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                  className="rounded-md border border-slate-200"
                />
              </div>
              {selectedDate && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4">Available Time Slots</h3>
                  {isLoadingTimeSlots ? (
                    <div className="flex flex-col items-center justify-center py-16 space-y-4">
                      <Loader2 className="w-8 h-8 animate-spin text-[#1C69D4]" />
                      <p className="text-slate-600">Loading available time slots...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {timeSlots.map((slot) => (
                        <Button
                          key={slot.id}
                          variant={appointmentData.timeSlot?.id === slot.id ? "default" : "outline"}
                          disabled={!slot.available}
                          onClick={() => setAppointmentData({ ...appointmentData, timeSlot: slot })}
                          className={`h-12 ${
                            appointmentData.timeSlot?.id === slot.id 
                              ? 'bg-[#1C69D4] hover:bg-[#1557B8]' 
                              : ''
                          }`}
                        >
                          {slot.time}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="text-center space-y-8 py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Appointment Scheduled!</h2>
              <p className="text-slate-600 text-lg">Your service appointment has been successfully scheduled.</p>
              {customerId && (
                <p className="text-sm text-slate-500 mt-2">Customer ID: {customerId}</p>
              )}
              {appointmentId && (
                <p className="text-sm text-slate-500">Appointment ID: {appointmentId}</p>
              )}
            </div>
            
            <Card className="max-w-2xl mx-auto text-left">
              <CardHeader>
                <CardTitle className="text-center">Appointment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Vehicle</h4>
                  <p className="text-slate-600">
                    {appointmentData.vehicle?.model} ({appointmentData.vehicle?.year})
                  </p>
                  <p className="text-sm text-slate-500">VIN: {appointmentData.vehicle?.vin.slice(-7)}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Dealership</h4>
                  <p className="text-slate-600">{appointmentData.dealership?.name}</p>
                  <p className="text-sm text-slate-500">{appointmentData.dealership?.address}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Services</h4>
                  {appointmentData.services.length > 0 ? (
                    <div className="space-y-1">
                      {appointmentData.services.map((service) => (
                        <p key={service.id} className="text-slate-600">• {service.name}</p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-600">General inspection</p>
                  )}
                </div>
                
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Transport</h4>
                  <p className="text-slate-600">{appointmentData.transportOption?.name}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Date & Time</h4>
                  <p className="text-slate-600">
                    {selectedDate?.toLocaleDateString()} at {appointmentData.timeSlot?.time}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Button 
              size="lg" 
              className="bg-[#1C69D4] hover:bg-[#1557B8] text-white px-8"
              onClick={() => {
                setCurrentStep(1);
                setAppointmentData({ services: [] });
                setSelectedDate(undefined);
                setVehicles([]); // Clear vehicles to trigger reload
                setServices([]); // Clear services to trigger reload
                setCustomerId(null); // Reset customer ID
              }}
            >
              Schedule Another Appointment
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-8">
      {/* Progress Steps */}
      <div className="mb-12">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;
            
            return (
              <div key={step.number} className="flex flex-col items-center relative">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  isCompleted ? 'bg-green-600' : isActive ? 'bg-[#1C69D4]' : 'bg-slate-200'
                }`}>
                  <Icon className={`w-5 h-5 ${
                    isCompleted || isActive ? 'text-white' : 'text-slate-500'
                  }`} />
                </div>
                <p className={`text-xs mt-2 text-center max-w-20 ${
                  isActive ? 'text-[#1C69D4] font-medium' : 'text-slate-600'
                }`}>
                  {step.title}
                </p>
                {index < steps.length - 1 && (
                  <div className={`absolute top-6 left-12 w-full h-0.5 -z-10 ${
                    isCompleted ? 'bg-green-600' : 'bg-slate-200'
                  }`} style={{ width: 'calc(100vw / 6)' }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-4xl mx-auto">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      {currentStep < 6 && (
        <div className="flex justify-between items-center mt-12 max-w-4xl mx-auto">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(currentStep - 1)}
            disabled={currentStep === 1}
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
          
          <Button
            onClick={handleNextStep}
            disabled={!canProceed() || isProcessingNext}
            className="bg-[#1C69D4] hover:bg-[#1557B8] text-white flex items-center space-x-2"
          >
            {isProcessingNext ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
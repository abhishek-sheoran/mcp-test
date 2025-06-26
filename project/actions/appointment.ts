



// Simulated API call for booking the appointment
import {AppointmentData, TimeSlot} from "@/types";

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

export { fetchTimeSlots, bookAppointment };
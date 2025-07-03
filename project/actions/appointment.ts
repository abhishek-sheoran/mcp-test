


"use server";
// Simulated API call for booking the appointment
import {AppointmentData, TimeSlot} from "@/types";

const SLOT_SIZE_IN_MINUTES = 15; 

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
const fetchTimeSlots = async (date: string): Promise<TimeSlot[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: '1', time: '9:00 AM', available: true },
                { id: '2', time: '10:15 AM', available: false },
            ]);
        }, 1000); // Simulate 1 second API delay
    });
};

export { fetchTimeSlots, bookAppointment };
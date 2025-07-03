"use server";
// Simulated API call for fetching vehicles
import {Vehicle} from "@/types";
import {mockUser} from "@/types/mock-data";

const fetchVehicles = async (): Promise<Vehicle[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockUser.vehicles);
        }, 2000); // Simulate 2 second API delay
    });
};

export { fetchVehicles };
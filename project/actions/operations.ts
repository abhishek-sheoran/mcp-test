

// Simulated API call for fetching available services
import {Service} from "@/types";

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

export { fetchServices };
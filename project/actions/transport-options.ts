"use server";
// Simulated API call for fetching transport options
import {TransportOption} from "@/types";

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

export { fetchTransportOptions };
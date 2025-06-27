

import { CustomerSearchRequest, CustomerSearchResponse, MyKaarmaCustomer } from '@/types/mykaarma';
import { getAuthToken, NEXT_PUBLIC_MYKAARMA_BASE_URL } from '@/utils/myk-auth-utils';

// Fetch customer by email from MyKaarma API
const getMyKaarmaCustomer = async (
  email: string, 
  departmentUUID: string
): Promise<{ customerData: MyKaarmaCustomer | null; error?: string }> => {
  try {
    if (!NEXT_PUBLIC_MYKAARMA_BASE_URL) {
      throw new Error('MyKaarma base URL is not configured');
    }

    const searchRequest: CustomerSearchRequest = {
      departmentUUID,
      fieldsToBeSearched: 'communications.commValue', // Search in communications for email
      maxResults: 10,
      searchTerm: email,
      queryOperator: 'AND'
    };

    const queryParams = new URLSearchParams({
      fieldsToBeSearched: searchRequest.fieldsToBeSearched || 'communications.commValue',
      maxResults: (searchRequest.maxResults || 10).toString(),
      searchTerm: searchRequest.searchTerm,
      queryOperator: searchRequest.queryOperator || 'AND'
    });

    const url = `${NEXT_PUBLIC_MYKAARMA_BASE_URL}/customer/v2/department/${departmentUUID}/customer/listMinimal?${queryParams}`;
    
    const authToken = getAuthToken();
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Basic ${authToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: CustomerSearchResponse = await response.json();
    
    // Check for API errors
    if (data.errors && data.errors.length > 0) {
      const errorMessage = data.errors.map(e => e.errorMessage).join(', ');
      return { customerData: null, error: errorMessage };
    }

    // Find customer with matching email
    const matchingCustomer = data.matchingCustomers.find(customer => 
      customer.communications.some(comm => 
        comm.commType === 'E' && 
        comm.commValue.toLowerCase() === email.toLowerCase()
      )
    );

    if (!matchingCustomer) {
      return { customerData: null, error: 'No customer found with the provided email' };
    }

    console.log('Customer found:', matchingCustomer);
    return { customerData: matchingCustomer };
    
  } catch (error) {
    console.error('Failed to fetch MyKaarma customer:', error);
    return { 
      customerData: null, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

export { getMyKaarmaCustomer };
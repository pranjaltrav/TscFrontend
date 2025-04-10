import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7120';

export interface DealerOnboardingData {
  id: number;
  dealerCode: string;
  loanProposalNo: string;
  name: string;
  dateOfOnboarding: string;
  pan: string;
  entityType: string;
  location: string;
  relationshipManager: string;
  status: string;
  roi: number;
  delayROI: number;
  sanctionAmount: number;
  availableLimit: number;
  outstandingAmount: number;
  overdueCount: number;
  documentStatus: number;
  stockAuditStatus: number;
  principalOutstanding: number;
  pfReceived: number;
  interestReceived: number;
  delayInterestReceived: number;
  amountReceived: number;
  pfAcrued: number;
  interestAccrued: number;
  delayInterestAccrued: number;
  isActive: boolean;
  registeredDate: string;
  waiverAmount: number;
  utilizationPercentage: number;
  userId: number;
}

// Using the same interface for consistency
export type Dealer = DealerOnboardingData;

export const DealerService = {
  /**
   * Create a new dealer onboarding record
   * @param dealerData The dealer onboarding data
   * @returns Promise with the created dealer data
   */
  createDealerOnboarding: async (dealerData: DealerOnboardingData): Promise<any> => {
    try {
      const response = await axios.post(
        `/api/Dealers/register`, 
        dealerData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating dealer onboarding:', error);
      throw error;
    }
  },
  
  /**
   * Get dealer onboarding status for the current user
   * @param userId The user ID to check onboarding status for
   * @returns Promise with the dealer onboarding data if exists
   */
  // getDealerOnboardingStatus: async (userId: string): Promise<any> => {
  //   try {
  //     const response = await axios.get(
  //       `${API_BASE_URL}/api/Dealer/onboarding/${userId}`,
  //       {
  //         headers: {
  //           'Accept': 'application/json'
  //         }
  //       }
  //     );
  //     return response.data;
  //   } catch (error) {
  //     console.error('Error fetching dealer onboarding status:', error);
  //     throw error;
  //   }
  // },

  /**
   * Get all dealers from the API
   * @returns Promise with array of dealer data
   */
  getAllDealers: async (): Promise<Dealer[]> => {
    try {
      const response = await axios.get(
        `/api/Dealers`,
        {
          headers: {
            'Accept': 'text/plain'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching all dealers:', error);
      throw error;
    }
  },

  /**
   * Get a specific dealer by ID
   * @param id The dealer ID to fetch
   * @returns Promise with the dealer data
   */
  getDealerById: async (id: number): Promise<Dealer> => {
    try {
      const response = await axios.get(
        `/api/Dealers/${id}`,
        {
          headers: {
            'Accept': 'text/plain'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching dealer with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Update an existing dealer
   * @param id The dealer ID to update
   * @param dealerData The updated dealer data
   * @returns Promise with the updated dealer data
   */
  updateDealer: async (id: number, dealerData: Partial<DealerOnboardingData>): Promise<Dealer> => {
    try {
      const response = await axios.put(
        `/api/Dealers/${id}`,
        dealerData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/plain'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating dealer with ID ${id}:`, error);
      throw error;
    }
  }
};

export default DealerService;
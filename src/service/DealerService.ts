import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7120';

interface DealerOnboardingData {
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
  getDealerOnboardingStatus: async (userId: string): Promise<any> => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/Dealer/onboarding/${userId}`,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching dealer onboarding status:', error);
      throw error;
    }
  }
};
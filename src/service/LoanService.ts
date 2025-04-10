import axios from 'axios';

export interface VehicleInfo {
  id: number;
  make: string;
  model: string;
  registrationNumber: string;
  year: number;
  chassisNumber: string;
  engineNumber: string;
  value: number;
}

export interface BuyerInfo {
  id: number;
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
  identificationType: string;
  identificationNumber: string;
  buyerSource: string;
}

export interface Loan {
  id: number;
  loanNumber: string;
  dateOfWithdraw: string;
  amount: number;
  interestRate: number;
  dealerId: number;
  dealerName: string;
  utrNumber: string;
  processingFee: number;
  dueDate: string;
  isActive: boolean;
  createdDate: string;
  vehicleInfo: VehicleInfo;
  buyerInfo: BuyerInfo;
  attachments: string[];
}

export interface LoanFilter {
  dealerId?: number;
  isActive?: boolean;
  fromDate?: string;
  toDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

const LoanService = {
  /**
   * Get all loans
   * @returns Promise with array of loan data
   */
  getAllLoans: async (): Promise<Loan[]> => {
    try {
      const response = await axios.get(
        `/api/Loans`,
        {
          headers: {
            'Accept': 'text/plain'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching all loans:', error);
      throw error;
    }
  },

  /**
   * Get all loans for a specific dealer
   * @param dealerId The dealer ID to fetch loans for
   * @returns Promise with array of dealer's loan data
   */
  getLoansByDealer: async (dealerId: number): Promise<Loan[]> => {
    try {
      const response = await axios.get(
        `/api/Loans/dealer/${dealerId}`,
        {
          headers: {
            'Accept': 'text/plain'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching loans for dealer with ID ${dealerId}:`, error);
      throw error;
    }
  },

  /**
   * Get a specific loan by ID
   * @param id The loan ID to fetch
   * @returns Promise with the loan data
   */
  getLoanById: async (id: number): Promise<Loan> => {
    try {
      const response = await axios.get(
        `/api/Loans/${id}`,
        {
          headers: {
            'Accept': 'text/plain'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching loan with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new loan
   * @param loanData The loan data to create
   * @returns Promise with the created loan data
   */
  createLoan: async (loanData: Omit<Loan, 'id'>): Promise<Loan> => {
    try {
      const response = await axios.post(
        `/api/Loans`,
        loanData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/plain'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating loan:', error);
      throw error;
    }
  },

  /**
   * Update an existing loan
   * @param id The loan ID to update
   * @param loanData The updated loan data
   * @returns Promise with the updated loan data
   */
  updateLoan: async (id: number, loanData: Partial<Loan>): Promise<Loan> => {
    try {
      const response = await axios.put(
        `/api/Loans/${id}`,
        loanData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/plain'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating loan with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a loan
   * @param id The loan ID to delete
   * @returns Promise with the operation result
   */
  deleteLoan: async (id: number): Promise<any> => {
    try {
      const response = await axios.delete(
        `/api/Loans/${id}`,
        {
          headers: {
            'Accept': 'text/plain'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error deleting loan with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Filter loans based on criteria
   * @param loans The loans array to filter
   * @param filters The filter criteria
   * @returns Filtered array of loans
   */
  filterLoans: (loans: Loan[], filters: LoanFilter): Loan[] => {
    return loans.filter(loan => {
      // Filter by dealer ID
      if (filters.dealerId !== undefined && loan.dealerId !== filters.dealerId) {
        return false;
      }
      
      // Filter by active status
      if (filters.isActive !== undefined && loan.isActive !== filters.isActive) {
        return false;
      }
      
      // Filter by min amount
      if (filters.minAmount !== undefined && loan.amount < filters.minAmount) {
        return false;
      }
      
      // Filter by max amount
      if (filters.maxAmount !== undefined && loan.amount > filters.maxAmount) {
        return false;
      }
      
      // Filter by date range
      if (filters.fromDate && new Date(loan.dateOfWithdraw) < new Date(filters.fromDate)) {
        return false;
      }
      
      if (filters.toDate && new Date(loan.dateOfWithdraw) > new Date(filters.toDate)) {
        return false;
      }
      
      return true;
    });
  }
};

export default LoanService;
import axios from 'axios';

export interface Representative {
  id: number;
  username: string;
  email: string;
  phoneNumber: string;
  userType: string;
  isActive: boolean;
  token: string | null;
}

export interface RepresentativeUpdateData {
  email: string;
  phoneNumber: string;
  isActive: boolean;
}

export interface RepresentativeCreateData {
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  userType: string;
  isActive: boolean;
}

const RepresentativeService = {
  /**
   * Get all representatives
   * @returns Promise with array of representative data
   */
  getAllRepresentatives: async (): Promise<Representative[]> => {
    try {
      const response = await axios.get(
        `/api/Auth/representatives`,
        {
          headers: {
            'Accept': 'text/plain'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching all representatives:', error);
      throw error;
    }
  },

  /**
   * Get a specific representative by ID
   * @param id The representative ID to fetch
   * @returns Promise with the representative data
   */
  getRepresentativeById: async (id: number): Promise<Representative> => {
    try {
      const response = await axios.get(
        `/api/Auth/representatives/${id}`,
        {
          headers: {
            'Accept': 'text/plain'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching representative with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Update an existing representative
   * @param id The representative ID to update
   * @param representativeData The updated representative data
   * @returns Promise with the updated representative data
   */
  updateRepresentative: async (id: number, representativeData: RepresentativeUpdateData): Promise<Representative> => {
    try {
      const response = await axios.put(
        `/api/Auth/representatives/${id}`,
        representativeData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/plain'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating representative with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new representative
   * @param representativeData The representative data to create
   * @returns Promise with the created representative data
   */
  createRepresentative: async (representativeData: RepresentativeCreateData): Promise<Representative> => {
    try {
      const response = await axios.post(
        `/api/Auth/representatives`,
        representativeData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/plain'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating representative:', error);
      throw error;
    }
  },

  /**
   * Delete a representative
   * @param id The representative ID to delete
   * @returns Promise with the operation result
   */
  deleteRepresentative: async (id: number): Promise<any> => {
    try {
      const response = await axios.delete(
        `/api/Auth/representatives/${id}`,
        {
          headers: {
            'Accept': '*/*'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error deleting representative with ID ${id}:`, error);
      throw error;
    }
  }
};

export default RepresentativeService;
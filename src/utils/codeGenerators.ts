/**
 * Generates a random dealer code with a prefix "DLR" followed by 6 digits
 * @returns A unique dealer code string
 */
export function generateDealerCode(): string {
    const randomDigits = Math.floor(100000 + Math.random() * 900000); // 6-digit number
    return `DLR${randomDigits}`;
  }
  
  /**
   * Generates a loan proposal number with a prefix "LPN" followed by 
   * current date and random digits
   * @returns A unique loan proposal number string
   */
  export function generateLoanProposalNo(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const randomDigits = Math.floor(1000 + Math.random() * 9000); // 4-digit number
    
    return `LPN${year}${month}${day}${randomDigits}`;
  }
/**
 * Indian Address Validation Utilities
 * For validating and formatting Indian addresses in checkout
 */

// All 36 Indian States and Union Territories
export const INDIAN_STATES = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
    // Union Territories
    'Andaman and Nicobar Islands',
    'Chandigarh',
    'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi',
    'Jammu and Kashmir',
    'Ladakh',
    'Lakshadweep',
    'Puducherry'
].sort();

/**
 * Validate Indian PIN code
 * Must be exactly 6 digits, first digit cannot be 0
 */
export const validatePincode = (pin: string): boolean => {
    const cleaned = pin.replace(/\D/g, '');
    return /^[1-9][0-9]{5}$/.test(cleaned);
};

/**
 * Validate Indian mobile number
 * Must be 10 digits starting with 6, 7, 8, or 9
 */
export const validatePhone = (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '');
    return /^[6-9]\d{9}$/.test(cleaned);
};

/**
 * Format phone number as +91 XXXXX XXXXX
 */
export const formatPhone = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
        return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    }
    if (cleaned.length > 10) {
        const last10 = cleaned.slice(-10);
        return `+91 ${last10.slice(0, 5)} ${last10.slice(5)}`;
    }
    return phone;
};

/**
 * Fetch city and state details from PIN code
 * Uses free India Post API
 */
export const fetchPincodeDetails = async (pincode: string): Promise<{
    city: string;
    state: string;
    district: string;
} | null> => {
    if (!validatePincode(pincode)) {
        return null;
    }

    try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await response.json();

        if (data && data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
            const postOffice = data[0].PostOffice[0];
            return {
                city: postOffice.District || postOffice.Name,
                state: postOffice.State,
                district: postOffice.Block || postOffice.Division
            };
        }
    } catch (err) {
        console.error('PIN code lookup failed:', err);
    }

    return null;
};

/**
 * Validate email address
 */
export const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Validate city name (basic - letters, spaces, hyphens only)
 */
export const validateCity = (city: string): boolean => {
    return /^[a-zA-Z\s\-]{2,}$/.test(city.trim());
};

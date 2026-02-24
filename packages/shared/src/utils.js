/**
 * Format a date to ISO string with a prefix for logging
 * @param {Date} date 
 * @returns {string}
 */
export const formatDate = (date = new Date()) => {
    return date.toISOString();
};

/**
 * Structured logger helper
 * @param {string} signal - Event name from EVENTS
 * @param {Object} data - Additional metadata
 */
export const createLogSignal = (signal, data = {}) => {
    return JSON.stringify({
        timestamp: formatDate(),
        signal,
        ...data
    });
};

/**
 * Simplified delay function for simulating latency
 * @param {number} ms 
 * @returns {Promise<void>}
 */
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

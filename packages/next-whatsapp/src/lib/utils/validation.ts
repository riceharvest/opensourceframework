// Validation utilities
export function validatePhoneNumber(phone: string): boolean {
    // Basic international phone number validation
    // Allows + followed by digits, spaces, hyphens, parentheses
    const phoneRegex = /^\+?[1-9]\d{1,14}(\s|-|\(|\))*\d*(\s|-|\(|\))*\d*$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

export function validateDateString(dateStr: string): boolean {
    const date = new Date(dateStr);
    return !isNaN(date.getTime()) && date.toISOString().startsWith(dateStr.slice(0, 10));
}

export function validatePositiveInteger(value: any, max?: number): boolean {
    const num = Number(value);
    return Number.isInteger(num) && num > 0 && (max === undefined || num <= max);
}

export function validateIntervalMinutes(minutes: any): boolean {
    return validatePositiveInteger(minutes, 1440); // Max 24 hours
}

export function validateDataRetentionDays(days: any): boolean {
    return validatePositiveInteger(days, 3650); // Max 10 years
}

// Input validation wrapper
export function validateRequiredFields(body: any, requiredFields: string[]): string | null {
    for (const field of requiredFields) {
        if (body[field] === undefined || body[field] === null || body[field] === '') {
            return `Missing required field: ${field}`;
        }
    }
    return null;
}

export function parseAndValidateDate(dateStr: string, fieldName: string): { date: Date | null, error: string | null } {
    if (!dateStr) return { date: null, error: null };
    if (!validateDateString(dateStr)) {
        return { date: null, error: `Invalid ${fieldName} format. Expected ISO date string.` };
    }
    return { date: new Date(dateStr), error: null };
}

// Logger utility
export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3
}

class Logger {
    private level: LogLevel = LogLevel.INFO;

    setLevel(level: LogLevel) {
        this.level = level;
    }

    debug(message: string, ...args: any[]) {
        if (this.level <= LogLevel.DEBUG) {
            console.debug(`[DEBUG] ${message}`, ...args);
        }
    }

    info(message: string, ...args: any[]) {
        if (this.level <= LogLevel.INFO) {
            console.info(`[INFO] ${message}`, ...args);
        }
    }

    warn(message: string, ...args: any[]) {
        if (this.level <= LogLevel.WARN) {
            console.warn(`[WARN] ${message}`, ...args);
        }
    }

    error(message: string, ...args: any[]) {
        if (this.level <= LogLevel.ERROR) {
            console.error(`[ERROR] ${message}`, ...args);
        }
    }
}

export const logger = new Logger();
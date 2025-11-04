// Regex configuration object for form validation

export const REGEX_CONFIG = {
  // Matches standard email addresses:
  // - Begins with allowed characters (letters, digits, ., _, %, +, -)
  // - Then '@', followed by a domain
  // - Domain must end with a dot and at least two letters (TLD)
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

  // Password requirements:
  // - At least 8 characters
  // - At least one lowercase letter
  // - At least one uppercase letter
  // - At least one digit
  // - At least one special character from @$!%*?&
  password:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
};

export const initialFormState = {
  name: '',
  email: '',
  password: '',
  message: '',
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const namePattern = /^[\p{L}0-9\s'\-.,]{2,}$/u;

export const validateField = (fieldName, value) => {
  const trimmedValue = value.trim();

  switch (fieldName) {
    case 'name':
      if (!trimmedValue) return 'Name is required.';
      if (!namePattern.test(trimmedValue)) return 'Name must include letters, numbers, and allowed punctuation only.';
      return '';
    case 'email':
      if (!trimmedValue) return 'Email is required.';
      if (!emailPattern.test(trimmedValue)) return 'Enter a valid email address.';
      return '';
    case 'password':
      if (!trimmedValue) return 'Password is required.';
      if (trimmedValue.length < 8) return 'Password must be at least 8 characters long.';
      return '';
    case 'message':
      if (!trimmedValue) return 'Message is required.';
      if (trimmedValue.length < 10) return 'Message must be at least 10 characters.';
      return '';
    default:
      return '';
  }
};

export const validateForm = (values) => {
  return Object.keys(values).reduce((acc, key) => {
    acc[key] = validateField(key, values[key]);
    return acc;
  }, {});
};

export const hasFormErrors = (errors) => {
  return Object.values(errors).some((error) => Boolean(error));
};

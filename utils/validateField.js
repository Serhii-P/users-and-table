export const validateField = (field, value) => {
  if (field === 'email') {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(value) ? true : false;
  } else if (field === 'firstName' || field === 'lastName') {
    const hasNumbers = /\d/.test(value);
    return hasNumbers ? false : true;
  }

  return true; 
};
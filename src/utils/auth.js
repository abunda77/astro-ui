// utils/auth.js

export const isAuthenticated = () => {
    if (typeof document !== 'undefined') {
      // Client-side
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('access_token='));
      return !!token;
    } else {
      // Server-side
      // You might want to implement server-side authentication check here
      // For now, we'll return false on the server side
      return false;
    }
  };
  
  export const getUsername = () => {
    if (typeof document !== 'undefined') {
      // Client-side
      const usernameCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('username='));
      return usernameCookie ? usernameCookie.split('=')[1] : null;
    } else {
      // Server-side
      // You might want to implement server-side username retrieval here
      // For now, we'll return null on the server side
      return null;
    }
  };
  
  // Add this function to set cookies safely
  export const setCookie = (name, value, days) => {
    if (typeof document !== 'undefined') {
      let expires = "";
      if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
      }
      document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    }
  };
  
  // Add this function to remove cookies safely
  export const removeCookie = (name) => {
    if (typeof document !== 'undefined') {
      document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
  };
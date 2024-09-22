// utils/auth.js
let globalUserId = null;


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

  // Fungsi untuk mendapatkan nilai cookie
  export const getCookie = (name) => {
    if (typeof document !== 'undefined') {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
    }
    // Server-side
    // Implementasi server-side untuk mendapatkan cookie bisa ditambahkan di sini
    // Untuk saat ini, kita kembalikan undefined pada sisi server
    return undefined;
  };

  let globalAccessToken = null;

  // ... kode lainnya tetap sama ...

export const setAccessToken = (token) => {
  globalAccessToken = token;
  setCookie('access_token', token, 7); // Simpan token ke cookie selama 7 hari
};

export const getAccessToken = () => {
  if (typeof window !== 'undefined') {
    if (!globalAccessToken) {
      globalAccessToken = getCookie('access_token');
    }
    return globalAccessToken;
  }
  return null;
};

export const setUserId = (userId) => {
  globalUserId = userId;
  setCookie('user_id', userId, 7); // Simpan user ID ke cookie selama 7 hari
};

export const getUserId = () => {
  if (typeof window !== 'undefined') {
    if (!globalUserId) {
      globalUserId = getCookie('user_id');
    }
    return globalUserId;
  }
  return null;
};
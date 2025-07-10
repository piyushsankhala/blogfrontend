



export const fetchWithRefresh = async (url, options = {}) => {
  try {
    const finalOptions = {
      ...options,
      credentials: "include",
      
    };

    let res = await fetch(url, finalOptions);

    if (res.status === 401) {
      const refreshRes = await fetch("https://blogbackend-3-l6mp.onrender.com/api/user/refresh", {
        method: "POST",
        credentials: "include", // important
      });

      if (refreshRes.ok) {
        console.log("Access token refreshed, retrying original request...");
        res = await fetch(url, finalOptions); // Retry with cookies again
      } else {
        console.warn("Refresh token failed. Cannot retry request.");
        throw new Error("Unauthorized: refresh token invalid");
      }
    }

    return res;
  } catch (error) {
    console.error("fetchWithRefresh error:", error);
    throw error;
  }
};

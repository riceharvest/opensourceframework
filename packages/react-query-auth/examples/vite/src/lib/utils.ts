export const storage = {
  getToken: () => {
    const rawValue = window.localStorage.getItem("token");
    if (!rawValue) return null;

    try {
      const parsedValue = JSON.parse(rawValue);
      if (typeof parsedValue !== "string") return null;

      const token = parsedValue.trim();
      // Prevent header injection and reject empty tokens.
      if (!token || /[\r\n]/.test(token)) return null;

      return token;
    } catch {
      return null;
    }
  },
  setToken: (token: string) =>
    window.localStorage.setItem("token", JSON.stringify(token)),
  clearToken: () => window.localStorage.removeItem("token"),
};

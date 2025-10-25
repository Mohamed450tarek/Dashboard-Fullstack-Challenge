import api from "@/lib/axios";

interface LoginData {
  email: string;
  password: string;
}

interface SignupData {
  username: string;
  email: string;
  password: string;
}

const authService = {
  login: (data: LoginData) => api.post("/auth/login", data),
  signup: (data: SignupData) => api.post("/auth/signup", data),
  forgotPassword: (email: string) => api.post("/auth/forgotPassword", { email }),
  verifyResetCode: (code: string, email: string) =>
    api.post("/auth/verifyResetCode", { code, email }),
  resetPassword: (email: string, newPassword: string) =>
    api.post("/auth/resetPassword", { email, password: newPassword }),
};

export default authService;

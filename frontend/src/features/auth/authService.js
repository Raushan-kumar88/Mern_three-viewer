import API from "../../utils/axiosInstance";

export const registerUser = async (data) => {
  const res = await API.post("/auth/register", data);
  return {
    ...res.data,
    status: res.status
  };
};

export const loginUser = async (data) => {
  const res = await API.post("/auth/login", data);
  return {
    ...res.data,
    status: res.status
  };
};
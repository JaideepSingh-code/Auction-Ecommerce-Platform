"use client";
export const setToken = (t: string) => localStorage.setItem("access_token", t);
export const getToken = () => typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
export const removeToken = () => localStorage.removeItem("access_token");
export const isAuthenticated = () => !!getToken();

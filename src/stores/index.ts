import { defineStore } from "pinia";
import type { IRootState } from "./types";

const useRootState = defineStore("root", {
  state: (): IRootState => {
    return {
      token: ""
    };
  },
  actions: {
    setToken(token: string) {
      this.token = token;
      const encryptedToken = btoa(token); // 使用 Base64 加密 token
      sessionStorage.setItem("token", encryptedToken); // 将加密后的 token 存入 sessionStorage
    },

    getToken(): string | null {
      const encryptedToken = sessionStorage.getItem("token");
      if (encryptedToken) {
        this.token = atob(encryptedToken); // 解密 token 并赋值给 this.token
        return this.token;
      }
      return null;
    }
  }
});

export default useRootState;

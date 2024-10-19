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
    }
  }
});

export default useRootState;

import { apiRequest } from "./queryClient";
import type { AIDetectorRequest, AIDetectorResponse, HumanizerRequest, HumanizerResponse } from "@shared/schema";

export const api = {
  async checkAI(data: AIDetectorRequest): Promise<AIDetectorResponse> {
    const response = await apiRequest("POST", "/api/check", data);
    return response.json();
  },

  async humanizeText(data: HumanizerRequest): Promise<HumanizerResponse> {
    const response = await apiRequest("POST", "/api/humanize", data);
    return response.json();
  },

  async health() {
    const response = await apiRequest("GET", "/api/health");
    return response.json();
  }
};

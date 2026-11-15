import { API_BASE_URL } from "../constants";
import { ApiClient } from "./ApiClient";

export const api = new ApiClient(API_BASE_URL);

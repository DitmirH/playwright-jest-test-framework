import axios from "axios";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const rawBaseUrl = process.env.REQRES_API_BASE_URL?.trim();
if (!rawBaseUrl) {
  throw new Error("REQRES_API_BASE_URL is required. Set it in .env (see .env.example)");
}
const API_BASE_URL = rawBaseUrl;

const rawKey = process.env.REQRES_API_KEY?.trim();
if (!rawKey) {
  throw new Error("REQRES_API_KEY is required. Set it in .env (see .env.example)");
}
const API_KEY = rawKey;

const axiosClient = axios.create({
  baseURL: `${API_BASE_URL}/users`,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": API_KEY,
  },
  validateStatus: () => true,
});

describe("ReqRes API", () => {
  it("GET /api/users - status 200 and response body fields", async () => {
    const res = await axiosClient.get("", {
      headers: { "x-api-key": API_KEY },
    });

    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty("page");
    expect(res.data).toHaveProperty("per_page");
    expect(res.data).toHaveProperty("total");
    expect(res.data).toHaveProperty("total_pages");
    expect(res.data).toHaveProperty("data");
    expect(Array.isArray(res.data.data)).toBe(true);

    if (res.data.data.length > 0) {
      const user = res.data.data[0];
      expect(user).toHaveProperty("id");
      expect(user).toHaveProperty("email");
      expect(user).toHaveProperty("first_name");
      expect(user).toHaveProperty("last_name");
      expect(user).toHaveProperty("avatar");
    }
  });

  it("POST /api/users – status 201 and response body fields", async () => {
    const res = await axiosClient.post(
      "",
      { name: "james mcdonalds" },
      { headers: { "x-api-key": API_KEY } }
    );

    expect(res.status).toBe(201);
    expect(res.data).toHaveProperty("name", "james mcdonalds");
    expect(res.data).toHaveProperty("id");
    expect(res.data).toHaveProperty("createdAt");
  });
});

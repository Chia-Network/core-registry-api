const superagent = require("superagent");

// Hosts should have the full path including scheme (http or https), port, and any subdirectories.
// No trailing slash.
const { CADT_HOST } = process.env
const { EXPLORER_HOST } = process.env
const { TOKENIZATION_ENGINE_HOST } = process.env
const { API_KEY } = process.env

describe("Uptime Tests", () => {
  it("CADT should pass", async () => {
    const response = await superagent
      .get(`${CADT_HOST}/health`)
      .set("x-api-key",API_KEY);

    expect(response.status).toBe(200);
  });

  it("Climate Explorer should pass", async () => {
    const response = await superagent
    .get(`${EXPLORER_HOST}/v1/activities`)
    .set("x-api-key",API_KEY);

    expect(response.status).toBe(200);
  });

  it("Climate Tokeninazation Engine should pass", async () => {
    const response = await superagent
    .get(`${TOKENIZATION_ENGINE_HOST}/v1/healthz`)
    .set("x-api-key",API_KEY);

    expect(response.status).toBe(200);
  });
});

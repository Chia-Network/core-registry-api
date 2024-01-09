const superagent = require("superagent");

// Hosts should have the full path including scheme (http or https), port, and any subdirectories.
// No trailing slash.
const { CADT_HOST } = process.env
const { EXPLORER_HOST } = process.env
const { TOKENIZATION_ENGINE_HOST } = process.env


describe("Uptime Tests", () => {
  it("CADT should pass", async () => {
    const response = await superagent.get(
      `${CADT_HOST}/health`
    );

    expect(response.status).toBe(200);
  });

  it("Climate Explorer should pass", async () => {
    const response = await superagent.get(
      `${EXPLORER_HOST}/v1/activities`
    );

    expect(response.status).toBe(200);
  });

  it("Climate Tokeninazation Engine should pass", async () => {
    const response = await superagent.get(
      `${TOKENIZATION_ENGINE_HOST}/healthz`
    );

    expect(response.status).toBe(200);
  });
});

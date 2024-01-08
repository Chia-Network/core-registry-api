const superagent = require("superagent");

// Hosts should have the full path including port and any subdirectories
const { CADT_HOST } = process.env
const { EXPLORER_HOST } = process.env
const { TOKENIZATION_ENGINE_HOST } = process.env


describe("Uptime Tests", () => {
  it("CADT should pass", async () => {
    const response = await superagent.get(
      `http://${CADT_HOST}/health`
    );

    expect(response.status).toBe(200);
  });

  it("Climate Explorer should pass", async () => {
    const response = await superagent.get(
      `http://${EXPLORER_HOST}/v1/activities`
    );

    expect(response.status).toBe(200);
  });

  it("Climate Tokeninazation Engine should pass", async () => {
    const response = await superagent.get(
      `http://${TOKENIZATION_ENGINE_HOST}/healthz`
    );

    expect(response.status).toBe(200);
  });
});

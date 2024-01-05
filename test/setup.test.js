const superagent = require("superagent");

const { CORE_REGISTRY_HOST } = process.env;

describe("Uptime Tests", () => {
  it("CADT should pass", async () => {
    const response = await superagent.get(
      `http://${CORE_REGISTRY_HOST}:31310/health`
    );

    expect(response.status).toBe(200);
  });

  it("Climate Explorer should pass", async () => {
    const response = await superagent.get(
      `http://${CORE_REGISTRY_HOST}:31313/v1/activities`
    );

    expect(response.status).toBe(200);
  });

  it("Climate Tokeninazation Engine should pass", async () => {
    const response = await superagent.get(
      `http://${CORE_REGISTRY_HOST}:31311/healthz`
    );

    expect(response.status).toBe(200);
  });
});

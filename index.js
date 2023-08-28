const pm2 = require("pm2");
const apps = require("./apps.json");

pm2.connect((err) => {
  if (err) {
    console.error(err);
    process.exit(2);
  }

  pm2.launchBus((err, bus) => {
    bus.on("log:out", (packet) => {
      let label;
      switch (packet.process.name) {
        case "CADT":
          label = packet.process.name;
          break;
        case "Climate Tokenization Engine":
          label = packet.process.name;
          break;
        case "Climate Token Driver":
          label = packet.process.name;
          break;
        case "Climate Explorer":
          label = packet.process.name;
          break;
        default:
          label = packet.process.name;
          break;
      }
      console.log(label + " " + packet.data.trim());
    });

    bus.on("log:err", (packet) => {
      console.error(packet.data);
    });

    const processConfig = (script, name) => ({
      script,
      name,
      interpreter: "none",
      autorestart: false,
    });

    pm2.start(processConfig(`apps/${apps.cadt}`, "CADT"), (err) => {
      if (err) console.error(err);
    });

    pm2.start(
      processConfig(`apps/${apps.climate_token_engine}`, "Climate Tokenization Engine"),
      (err) => {
        if (err) console.error(err);
      }
    );

    pm2.start(
      processConfig(
        `apps/${apps.climate_token_driver}`,
        "Climate Token Driver"
      ),
      (err) => {
        if (err) console.error(err);
      }
    );

    pm2.start(
      processConfig(`apps/${apps.climate_explorer}`, "Climate Explorer"),
      (err) => {
        if (err) console.error(err);
      }
    );
  });
});

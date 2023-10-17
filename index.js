const { spawn } = require("child_process");
const apps = require("./apps.json");
const processList = [];

const startChildProcess = async (executable, name) => {
  return new Promise((resolve, reject) => {
    const childProcess = spawn(executable, [], {
      detached: true,
      stdio: ["ignore", "pipe", "pipe"], // Capture stdout and stderr
    });

    childProcess.stdout.on("data", (data) => {
      // Display stdout of child process in the main process
      console.log(`[${name}] ${data.toString().trim()}`);
    });

    childProcess.stderr.on("data", (data) => {
      // Handle stderr if needed
      console.error(`[${name}] Error: ${data.toString().trim()}`);
    });

    childProcess.on("error", (err) => {
      console.error(`Error starting ${name}:`, err);
      reject(err);
    });

    childProcess.on("exit", (code, signal) => {
      console.log(`${name} exited with code ${code} and signal ${signal}`);

      if (code !== 0) {
        // Restart the process because it stopped unexpectedly
        startChildProcess(executable, name);
      }

      resolve();
    });

    childProcess.unref(); // Unreference the child process to allow the main process to exit independently

    processList.push(childProcess); // Store child process in the list
  });
};

const startChildProcesses = async () => {
  // Process "cadt" first
  if (apps.hasOwnProperty("cadt")) {
    try {
      startChildProcess(`apps/${apps["cadt"]}`, "cadt");
      await new Promise((resolve) => setTimeout(resolve, 5000));
    } catch (error) {
      console.error(error.message);
    }
  }

  // Process "climate_explorer" second
  if (apps.hasOwnProperty("climate_explorer")) {
    try {
      startChildProcess(`apps/${apps["climate_explorer"]}`, "climate_explorer");
      await new Promise((resolve) => setTimeout(resolve, 5000));
    } catch (error) {
      console.error(error.message);
    }
  }

  if (apps.hasOwnProperty("climate_token_driver")) {
    try {
      startChildProcess(
        `apps/${apps["climate_token_driver"]}`,
        "climate_token_driver"
      );
      await new Promise((resolve) => setTimeout(resolve, 5000));
    } catch (error) {
      console.error(error.message);
    }
  }

  // Process the remaining keys
  for (const name of Object.keys(apps)) {
    if (
      name === "cadt" ||
      name === "climate_explorer" ||
      name === "climate_token_driver"
    ) {
      continue; // Skip if already processed
    }

    const executable = `apps/${apps[name]}`;
    try {
      startChildProcess(executable, name);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    } catch (error) {
      console.error(error.message);
    }
  }
};

process.on("SIGINT", () => {
  console.log("Received SIGINT signal. Terminating child processes...");

  // Terminate child processes
  for (const childProcess of processList) {
    childProcess.kill("SIGINT"); // Send SIGINT to child process
  }

  // Give some time for child processes to exit gracefully
  setTimeout(() => {
    process.exit(0); // Exit the main process
  }, 5000); // Adjust the delay as needed
});

// Listen for the exit event of the main process
process.on("exit", () => {
  console.log("Exiting...");

  // Terminate all child processes
  for (const childProcess of processList) {
    childProcess.kill();
  }
});

startChildProcesses();

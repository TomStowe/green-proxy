import GreenProxy from "./greenlock-proxy";
import fs from "fs";

type Config = {
  maintainerEmail: string;
  staging: boolean;
  sites: {
    domains: string[];
    targets: string[];
  }[];
};

// Load from config file
console.log("Loading config data");
const configLocation = "config.json";
let success = true;
let configData: Config | null = null;
try {
  const configRawData = fs.readFileSync(configLocation)?.toString();
  configData = JSON.parse(configRawData);
} catch {
  success = false;
}

if (!success || !configData) {
  throw Error(
    `No or invalid config data found. Please add config data to ${configLocation}`
  );
}

// Setup the proxy
console.log("Setting up proxy");
var proxy = new GreenProxy({
  maintainerEmail: configData.maintainerEmail,
  staging: configData.staging,
});

for (const site of configData.sites) {
  proxy.register(site.domains, site.targets);
}

// Start proxiyng
proxy.start();
console.log("Proxy Started");

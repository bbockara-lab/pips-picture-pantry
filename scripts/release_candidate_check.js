import { spawn, spawnSync } from "node:child_process";
import http from "node:http";

const isWindows = process.platform === "win32";
const port = Number(process.env.PPP_QA_PORT || 5173);
const baseUrl = "http://127.0.0.1:" + port + "/";
const checks = [
  ["test", "npm run test -- --run"],
  ["catalog", "npm run qa:catalog"],
  ["hygiene", "npm run qa:hygiene"],
  ["assets", "npm run qa:assets"],
  ["store assets", "npm run qa:store"],
  ["build", "npm run build"],
  ["release gate", "npm run qa:release"]
];

function commandFor(command) {
  return isWindows
    ? { file: "cmd.exe", args: ["/d", "/s", "/c", command] }
    : { file: "sh", args: ["-lc", command] };
}

function runCheck(label, command) {
  console.log("\n== " + label + " ==");
  const executable = commandFor(command);
  const result = spawnSync(executable.file, executable.args, { stdio: "inherit", shell: false });
  if (result.status !== 0) {
    throw new Error(label + " failed with exit code " + result.status + (result.signal ? " signal " + result.signal : "") + (result.error ? " error " + result.error.message : ""));
  }
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function probe(url) {
  return new Promise((resolve) => {
    const req = http.request(url, { method: "HEAD", timeout: 1200 }, (res) => {
      res.resume();
      resolve(res.statusCode || 0);
    });
    req.on("timeout", () => {
      req.destroy();
      resolve(0);
    });
    req.on("error", () => resolve(0));
    req.end();
  });
}

async function waitForServer(url) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const status = await probe(url);
    if (status >= 200 && status < 500) {
      return status;
    }
    await wait(500);
  }
  throw new Error("Dev server did not respond at " + url);
}

async function main() {
  for (const [label, command] of checks) {
    runCheck(label, command);
  }

  console.log("\n== dev server + mobile QA ==");
  const occupiedStatus = await probe(baseUrl);
  if (occupiedStatus) {
    throw new Error("Port " + port + " already responded with status " + occupiedStatus + ". Stop the existing dev server before running qa:candidate.");
  }

  const serverCommand = commandFor("npm run dev -- --port " + port + " --strictPort");
  const server = spawn(serverCommand.file, serverCommand.args, {
    stdio: ["ignore", "pipe", "pipe"],
    shell: false,
    windowsHide: true
  });

  server.stdout.on("data", (chunk) => process.stdout.write(chunk));
  server.stderr.on("data", (chunk) => process.stderr.write(chunk));

  try {
    const status = await waitForServer(baseUrl);
    console.log("HTTP probe passed with status " + status + ".");
    runCheck("mobile QA", "npm run qa:mobile");
    const finalStatus = await probe(baseUrl);
    if (finalStatus !== 200) {
      throw new Error("Expected HTTP 200 from " + baseUrl + ", saw " + finalStatus);
    }
    console.log("Release candidate check passed.");
  } finally {
    if (isWindows && server.pid) {
      spawnSync("taskkill", ["/pid", String(server.pid), "/t", "/f"], { stdio: "ignore" });
    } else {
      server.kill();
    }
    await wait(300);
  }
}

main().catch((error) => {
  console.error("Release candidate check failed:");
  console.error(error.message);
  process.exit(1);
});

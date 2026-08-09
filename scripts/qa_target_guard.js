const LOOPBACK_HOSTS = new Set(["127.0.0.1", "localhost", "::1", "[::1]"]);

export function assertIsolatedQaTarget(targetUrl, scriptName = "QA script") {
  let parsed;
  try {
    parsed = new URL(targetUrl);
  } catch {
    throw new Error(`${scriptName} requires a valid local QA URL; received ${targetUrl}`);
  }

  if (!LOOPBACK_HOSTS.has(parsed.hostname) || !["http:", "https:"].includes(parsed.protocol)) {
    throw new Error(
      `${scriptName} refuses to seed player progress outside a loopback web origin: ${parsed.origin}`,
    );
  }
}

import app from "./app";
import { logger } from "./lib/logger";
import { seedPublicSignalData } from "./lib/seed-public-data";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

try {
  await seedPublicSignalData();
  app.listen(port, (err) => {
    if (err) {
      logger.error({ err }, "Error listening on port");
      process.exit(1);
    }

    logger.info({ port }, "Server listening");
  });
} catch (error) {
  logger.error({ err: error }, "Unable to seed public signal data");
  process.exit(1);
}

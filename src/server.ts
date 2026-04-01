import { env } from "@common/config/env";
import app from "./app";
import { connectDB } from "@common/db";

const start = async (): Promise<void> => {
  await connectDB();

  app.listen(env.PORT, () => {
    console.log(
      `Server is running on port ${env.PORT} in ${env.NODE_ENV} mode`,
    );
  });
};
start();

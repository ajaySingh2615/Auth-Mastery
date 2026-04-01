import { env } from "@common/config/env";
import app from "./app";

const start = async (): Promise<void> => {
  app.listen(env.PORT, () => {
    console.log(
      `Server is running on port ${env.PORT} in ${env.NODE_ENV} mode`,
    );
  });
};
start();

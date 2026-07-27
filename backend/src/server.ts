import { app } from "./app.js";
import { config } from "./config.js";

app.listen(config.port, () => {
  console.log(`MeloBiz API đang chạy tại http://localhost:${config.port}`);
});

import { app } from "./expressApp.js";

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🌸 Shinchan Comfort Corner running on http://0.0.0.0:${PORT}`);
});

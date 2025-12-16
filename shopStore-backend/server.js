const app = require("./app");
const { connectDB } = require("./config/db");

(async () => {
  try {
    await connectDB();
    const port = process.env.PORT || 8000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
})();

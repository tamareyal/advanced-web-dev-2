import init from "./index";

const PORT = process.env.PORT || 3000;

init().then((app) => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error("Failed to initialize the server:", error);
});
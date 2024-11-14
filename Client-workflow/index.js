const server = require("./src/server");

const port = process.env.PORT;

const startServer = () => {
  server.listen(port, () => {
    console.log(`server running on port ${port}`);
  });
};
startServer();

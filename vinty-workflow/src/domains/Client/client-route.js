const express = require("express");
const router = express.Router();
const clientController = require("./client-controller");

router.delete("/:clientId/search-list", clientController.deleteWholeSearchList);

router.delete(
  "/:clientId/search-list/:name",
  clientController.deleteSearchByName
);

router.get("/:clientId/search-list", clientController.getSearchList);

module.exports = router;

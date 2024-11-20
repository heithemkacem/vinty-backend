const express = require("express");
const router = express.Router();
const clientController = require("./client-controller");
const auth = require("../../middleware/auth");

router.delete("/:clientId/search-list", clientController.deleteWholeSearchList);

router.delete(
  "/:clientId/search-list/:name",
  clientController.deleteSearchByName
);
router.get("/:clientId/search-list", clientController.getSearchList);
router.put("/:id", clientController.updateClient);
router.delete("/:id", clientController.deleteClient);
router.post("/favorites/add", auth, clientController.addToFavorites);
router.get("/favorites", auth, clientController.getFavorites);
router.delete("/favorites/remove", auth, clientController.removeFromFavorites);

module.exports = router;

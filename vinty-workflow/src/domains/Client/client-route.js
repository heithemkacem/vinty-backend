const express = require("express");
const router = express.Router();
const clientController = require("./client-controller");

router.delete("/:clientId/search-list", clientController.deleteWholeSearchList);

router.delete(
  "/:clientId/search-list/:name",
  clientController.deleteSearchByName
);
router.get("/:clientId/search-list", clientController.getSearchList);
router.put('/:id', clientController.updateClient); 
router.delete('/:id',clientController.deleteClient); 

module.exports = router;

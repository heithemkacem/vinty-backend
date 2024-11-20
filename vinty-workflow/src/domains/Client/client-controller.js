const { createErrorResponse } = require('../../utils/Error-handle'); 
const { Client } = require('../../models/index');

exports.updateRecentSearch = async (clientId, searchTerm) => {
  try {
    await Client.findByIdAndUpdate(
      clientId,
      { $addToSet: { recent_search: searchTerm } },
      { new: true }
    );
  } catch (error) {
    console.error('Error updating recent searches:', error);
  }
};

// Delete the whole search list for a client
exports.deleteWholeSearchList = async (req, res) => {
  const clientId = req.user.userData._id; 

  try {
    await Client.updateOne(
      { _id: clientId },
      { $set: { recent_search: [] } }
    );
    res.status(200).json({ message: "Search list deleted successfully" });
  } catch (error) {
    console.error("Error deleting search list:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


// Delete a search item by name for a specific client
exports.deleteSearchByName = async (req, res) => {
  const clientId = req.user.userData._id; 
  const { name } = req.body; 

  try {
    const result = await Client.updateOne(
      { _id: clientId },
      { $pull: { recent_search: name } }
    );

    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .json({ message: "Search item not found" });
    }

    res.status(200).json({ message: "Search item deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


// Get the whole search list for a client
exports.getSearchList = async (req, res) => {
  const clientId = req.user.userData._id;

  try {
    const client = await Client.findById(clientId);

    if (!client) {
      return res
        .status(404)
        .json({ message: "Client not found" });
    }

    res.status(200).json({ recent_search: client.recent_search });
  } catch (error) {
    console.error("Error fetching search list:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


exports.updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const client = await Client.findByIdAndUpdate(id, updates, { new: true });
    if (!client) return res.status(404).json(createErrorResponse('Client not found', 404));
    res.status(200).json(client);
  } catch (error) {
    res.status(500).json(createErrorResponse(error.message, 500));
  }
};

exports.deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await Client.findByIdAndDelete(id);
    if (!client) return res.status(404).json(createErrorResponse('Client not found', 404));
    res.status(200).json({ message: 'Client deleted successfully' });
  } catch (error) {
    res.status(500).json(createErrorResponse(error.message, 500));
  }
};

exports.addToFavorites = async (req, res) => {
  try {
    const { vendingMachineId } = req.body;
    const clientId = req.user.userData._id;
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json(createErrorResponse('Client not found', 404));
    }

    if (client.favorites.includes(vendingMachineId)) {
      return res.status(400).json(createErrorResponse('Vending machine already in favorites', 400));
    }

    client.favorites.push(vendingMachineId);
    await client.save();
    return res.status(200).json({ message: 'Vending machine added to favorites' });
  } catch (err) {
    return res.status(500).json(createErrorResponse('Error adding to favorites', 500));
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const clientId = req.user.userData._id;
    const client = await Client.findById(clientId).populate({
      path: 'favorites',
      select: 'name location position',
    });

    if (!client) {
      return res.status(404).json(createErrorResponse('Client not found', 404));
    }

    return res.status(200).json({
      message: 'Favorites retrieved successfully',
      favorites: client.favorites,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(createErrorResponse('Server error', 500));
  }
};

exports.removeFromFavorites = async (req, res) => {
  try {
    const { vendingMachineId } = req.body;
    const clientId = req.user.userData._id;

    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json(createErrorResponse('Client not found', 404));
    }

    if (!client.favorites.includes(vendingMachineId)) {
      return res.status(400).json(createErrorResponse('Vending machine not in favorites', 400));
    }

    client.favorites = client.favorites.filter((id) => id.toString() !== vendingMachineId);
    await client.save();

    return res.status(200).json({ message: 'Vending machine removed from favorites'});
  } catch (err) {
    return res.status(500).json(createErrorResponse('Error removing from favorites', 500));
  }
};

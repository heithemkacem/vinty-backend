const {Client} = require('../../models/index');

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
  const { clientId } = req.params;
  console.log(clientId)
  try {
    
    await Client.updateOne(
      { _id: clientId },
      { $set: { recent_search: [] } }
    );

    res.status(200).json({ message: 'Search list deleted successfully' });
  } catch (error) {
    console.error('Error deleting search list:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Delete a search item by name for a specific client
exports.deleteSearchByName = async (req, res) => {
  const { clientId, name } = req.params;
  
  try {
   
      const result = await Client.updateOne(
          { _id: clientId },
          { $pull: { recent_search: name } } 
      );

      if (result.modifiedCount === 0) {
          return res.status(404).json({ message: 'Search item not found' });
      }

      res.status(200).json({ message: 'Search item deleted successfully' });
  } catch (error) {
      console.error('Delete error:', error);
      res.status(500).json({ message: 'Server error' });
  }
};


// Get the whole search list for a client
exports.getSearchList = async (req, res) => {
  const { clientId } = req.params;
  try {
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.status(200).json({ recent_search: client.recent_search });
  } catch (error) {
    console.error('Error fetching search list:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



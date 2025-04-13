const Item = require('../models/Item');

module.exports = {
  createItem: async (itemData) => {
    return await Item.create(itemData);
  },

  getAllItems: async () => {
    return await Item.getAll();
  }
};
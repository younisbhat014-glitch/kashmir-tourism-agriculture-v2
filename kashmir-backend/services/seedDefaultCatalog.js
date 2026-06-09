const AppSetting = require('../models/AppSetting');
const Hotel = require('../models/Hotel');
const Restaurant = require('../models/Restaurant');
const Vehicle = require('../models/Vehicle');
const Crop = require('../models/Crop');
const Machine = require('../models/Machine');
const defaults = require('../data/defaultCatalog');

const SEED_KEY = 'default-catalog-v2';

const seedMissing = async (Model, items) => {
  await Model.bulkWrite(items.map((item) => ({
    updateOne: {
      filter: { name: item.name },
      update: { $setOnInsert: item },
      upsert: true,
    },
  })));
};

module.exports = async function seedDefaultCatalog() {
  if (await AppSetting.exists({ key: SEED_KEY })) return;

  await seedMissing(Hotel, defaults.hotels);
  await seedMissing(Restaurant, defaults.restaurants);
  await seedMissing(Vehicle, defaults.vehicles);
  await seedMissing(Crop, defaults.crops);
  await seedMissing(Machine, defaults.machines);
  await AppSetting.create({ key: SEED_KEY, value: true });
};

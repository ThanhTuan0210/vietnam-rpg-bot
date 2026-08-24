const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://so44so777_db_user:z1NEfch6eGbkaOCU@cluster0.idd06f0.mongodb.net/vietnam_rpg_bot?retryWrites=true&w=majority';

async function wipeDatabase() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log('Connected!');

  const collections = await mongoose.connection.db.collections();

  for (const collection of collections) {
    const name = collection.collectionName;
    console.log(`Wiping collection: ${name}...`);
    await collection.deleteMany({});
    console.log(`Collection ${name} wiped clean!`);
  }

  console.log('ALL PLAYER DATA HAS BEEN 100% WIPED CLEAN!');
  await mongoose.disconnect();
  process.exit(0);
}

wipeDatabase().catch((err) => {
  console.error('Wipe failed:', err);
  process.exit(1);
});

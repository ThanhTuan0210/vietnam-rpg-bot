const mongoose = require('mongoose');

async function checkUsers() {
  await mongoose.connect('mongodb+srv://dinhthanhtuan02102005:Tuan123456@cluster0.naw2c.mongodb.net/rpg_bot?retryWrites=true&w=majority');
  console.log('Connected to MongoDB!');

  const db = mongoose.connection.db;
  const users = await db.collection('useradvanceds').find({}).toArray();

  console.log(`Found ${users.length} total users in useradvanceds:`);
  for (const u of users) {
    console.log(`User ID: ${u.userId}, Name: ${u.danhHieu}, Gold: ${u.taiChinh?.dong}`);
    console.log(`Inventory (${u.inventory?.length || 0}):`, u.inventory);
    console.log(`TuiDo (${u.tuiDo?.length || 0}):`, u.tuiDo);
    console.log(`Equipped:`, u.trangBi);
  }

  process.exit(0);
}

checkUsers().catch(console.error);

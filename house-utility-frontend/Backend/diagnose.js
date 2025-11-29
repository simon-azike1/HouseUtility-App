const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://houseadmin:MyPass123@cluster0.w7xjygu.mongodb.net/house-utility?retryWrites=true&w=majority';

async function diagnose() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('🔄 Attempting to connect...');
    await client.connect();
    console.log('✅ Connected successfully!\n');
    
    // List all databases
    console.log('📚 Available databases:');
    const adminDb = client.db().admin();
    const dbs = await adminDb.listDatabases();
    dbs.databases.forEach(db => {
      console.log(`  - ${db.name}`);
    });
    
    console.log('\n---\n');
    
    // Check specific databases
    const databasesToCheck = ['house-utility', 'houseadmin'];
    
    for (const dbName of databasesToCheck) {
      console.log(`📂 Checking database: "${dbName}"`);
      const db = client.db(dbName);
      const collections = await db.listCollections().toArray();
      
      if (collections.length === 0) {
        console.log(`  ⚠️  No collections found in "${dbName}"`);
      } else {
        console.log(`  Collections found:`);
        for (const col of collections) {
          const collection = db.collection(col.name);
          const count = await collection.countDocuments();
          console.log(`    - ${col.name} (${count} documents)`);
        }
      }
      console.log('');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\nFull error:', error);
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

diagnose();
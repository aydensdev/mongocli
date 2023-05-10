const {MongoClient} = require('mongodb'),
password = 'N43stRwzoTZhECSi', 
mongoURI = `mongodb+srv://NodeDatabase:${password}@nodecluster.ixusm.mongodb.net/?retryWrites=true&w=majority`,
//mongoURI = `mongodb+srv://NodeDatabase:${password}@nodecluster.ixusm.mongodb.net/nodedatabase?retryWrites=true&w=majority`, 
client = new MongoClient(mongoURI, {useNewUrlParser:true, useUnifiedTopology:true});
main();
async function main(){
    await client.connect(async (err) => {
        const collection = client.db('nodedatabase').collection("nodecollection");
        await collection.deleteMany({type:'user'});
        console.log('Erased all user accounts.')
        client.close();
    });
}

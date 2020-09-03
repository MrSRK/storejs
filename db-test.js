const mongoose=require('mongoose')
try
{
	mongoose.connect('mongodb+srv://user_saloras:S5ZYcYolyUl2SWxM@saloras-4rocn.gcp.mongodb.net/saloras?authSource=admin&compressors=zlib&gssapiServiceName=mongodb&replicaSet=Prod-shard-0&ssl=true',{
		useUnifiedTopology:true,
		useFindAndModify:false,
		useCreateIndex:true,
		useNewUrlParser:true
	})
	console.log('Connection Try')
}
catch(error)
{
	console.log(error)
}
const express=require('express')
const mongoose=require('mongoose')
try
{
	mongoose.connect('mongodb+srv://user_saloras:S5ZYcYolyUl2SWxM@saloras-4rocn.gcp.mongodb.net/saloras?authSource=admin&compressors=zlib&gssapiServiceName=mongodb&replicaSet=Prod-shard-0&ssl=true',{
		useUnifiedTopology:true,
		useFindAndModify:false,
		useCreateIndex:true,
		useNewUrlParser:true
	})
	const app=express()
	// Mongo
	const schema=new mongoose.Schema({
		active:{type:Boolean},
		name:{type:String}
	},
	{
		timestamps:true,
		versionKey:false
	})
	const model=mongoose.model('article',schema)
	app.all('*',(req,res)=>
	{
		model.find({},(error,data)=>
		{
			if(error)
				console.log(error)
			res.status(200).send(data)
		})
	})
	app.listen(80)
}
catch(error)
{
	console.log(error)
}
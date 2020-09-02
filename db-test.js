"use strict"
const mongoose=require('mongoose')
require('mongoose-schema-jsonschema')(mongoose)
try
{
	mongoose.connect(process.env.MONGODB_URI,{
		useUnifiedTopology:true,
		useFindAndModify:false,
		useCreateIndex:true,
		useNewUrlParser:true
	})
	return console.log(process.env.MONGODB_URI)
}
catch(error)
{
	return console.log(error)
}
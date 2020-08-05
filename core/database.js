"use strict"
const mongoose=require('mongoose')
require('mongoose-schema-jsonschema')(mongoose)
class Database
{
	instance=null
	constructor(config,next)
	{
		try
		{
			mongoose.connect(process.env.MONGODB_URI,{
				useUnifiedTopology:true,
				useFindAndModify:false,
				useCreateIndex:true,
				useNewUrlParser:true
			})
			return next(true,null,mongoose)
		}
		catch(error)
		{
			return next(false,error)
		}
	}
}
module.exports=Database
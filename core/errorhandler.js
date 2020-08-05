"use strict"
const errorhandler=require('errorhandler')
class Errorhandler
{
	instance=null
	constructor(config,next)
	{
		try
		{
			if(process.env.NODE_ENV==='development')
				return next(true,null,errorhandler())
			return next(false)
		}
		catch(error)
		{
			return next(false,error)
		}
	}
}
module.exports=Errorhandler
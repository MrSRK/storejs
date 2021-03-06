"use strict"
const bodyParser=require('body-parser')
class Parser
{
	instance=null
	constructor(config,next)
	{
		try
		{
			next(true,null,bodyParser.json())
			next(true,null,bodyParser.urlencoded({extended:true}))
			return true
		}
		catch(error)
		{
			return next(false,error)
		}
	}
}
module.exports=Parser
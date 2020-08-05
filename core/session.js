"use strict"
const expresssession=require('express-session')
const mongoose=require('mongoose')
const MongoStore=require('connect-mongo')(expresssession)
class Session
{
    instance=null
    constructor(config,next)
    {
        try
        {
            const options={
                resave:true,
                saveUninitialized:true,
                secret:process.env.SESSION_SECRET,
				store:new MongoStore({mongooseConnection:mongoose.connection}),
				cookie:
				{
					sameSite:true
				}
            }
            return next(true,null,expresssession(options))
        }
        catch(error)
        {
            return next(false,error)
        }
    }
}
module.exports=Session
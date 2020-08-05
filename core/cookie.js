"use strict"
const cookieParser=require('cookie-parser')
class Cookie
{
    instance=null
    constructor(config,next)
    {
        try
        {
            const age=parseInt(process.env.COOKIE_AGE)
            const options={
                sameSite:true,
                secure:true,
                maxAge:age
            }
            return next(true,null,cookieParser(process.env.COOKIE_SECRET,options))
        }
        catch(error)
        {
            return next(false,error)
        }
    }
}
module.exports=Cookie
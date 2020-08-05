"use strict"
const lusca=require('lusca')
class Security
{
    instance=null
    constructor(config,next)
    {
        try
        {
            const options=config.security||{}
            return next(true,null,lusca(options))
        }
        catch(error)
        {
            return next(false,error)
        }
    }
}
module.exports=Security
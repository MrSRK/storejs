"use strict"
const sassmiddleware=require('node-sass-middleware')
const path=require('path')
class Sass
{
    instance=null
    constructor(config,next)
    {
        try
        {
            const options={
                outputStyle:process.env.SASS_OUTPUT||'compressed',
                src:path.join(__dirname,'../'+process.env.SASS_SRC),
                dest: path.join(__dirname,'../'+process.env.SASS_DEST),
				maxAge:parseInt(process.env.SASS_MAXAGE),
				force:true
			}
            return next(true,null,sassmiddleware(options))
        }
        catch(error)
        {
            return next(false,error)
        }
    }
}
module.exports=Sass
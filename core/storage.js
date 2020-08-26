const multer=require('multer')
const fs=require('fs')
const path=require('path')
class Storage
{
	instance=null
	config={}
    constructor(config,subroot,name,next)
    {
        try
        {
			this.config=config.multer||{}
			this.config.subroot=subroot
			this.config.name=name
			const storage=multer.diskStorage(
			{
				destination:destination,
				filename:filename
			})
			return next(true,null,multer({storage:storage}).single(this.config.name))
        }
        catch(error)
        {
            return next(false,error)
        }
	}
	destination=(req,file,next)=>
	{
		try
		{
			const filepath=path.join(__dirname, '../../'+this.config.root+this.config.subroot)
			return fs.exists(filepath,exists=>
			{
				if(!exists)
					return fs.mkdir(filepath,{recursive:true},error=>
					{
						if(error)
							throw(error)
						return next(null,filepath)
					})
				else
					return next(null,filepath)
			})
		}
		catch(error)
		{
			console.log(error)
			return next(error)
		}
	}
	filename=(req,file,next)=>
	{
		try
		{
			const filepath=path.join(__dirname, '../../'+this.config.root+this.config.subroot)
			let ext=''
			if(file.originalname.lastIndexOf('.')>=0)
				ext='.'+file.originalname.split('.').reverse()[0]
			if(typeof req.files==undefined||!req.files)
				req.files={}
			var name=Date.now()+ext
			file.filename=name
			file.path=filepath+'/'+name
			req.files[this.config.name]=file
			return next(null,name)
		}
		catch(error)
		{
			console.log(error)
			return next(error,null)
		}
	}
}
module.exports=Storage
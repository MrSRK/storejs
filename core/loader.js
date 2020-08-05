"use strict"
const path=require('path')
const fs=require('fs')
const pug=require('pug')
class Loader
{
	instance=null
	views=[]
	modules=[]
	constructor(app,config,next)
	{
		try
		{
			// Set Default Template Engine
			app.set('view engine', 'pug')
			this.views.push(path.join(__dirname,'../'+process.env.APP_VIEWS))
			const module_path=path.join(__dirname,'../'+process.env.APP_MODULES)
			fs.exists(module_path,exists=>
			{
				if(!exists)
					return next(new Error("Module's path not exists"))
				fs.readdir(module_path,(error,files)=>
				{
					if(error)
						return next(error)
					let fire=files.length
					if(files)
						files.forEach(file=>
						{
							//Load Views
							var views_path=path.join(__dirname,'../'+process.env.APP_MODULES+file+'/views/')
							this.views.push(views_path)
							app.set('views',this.views)
							//Load Module
							this.modules[file]=new (require(path.join(__dirname,'../'+process.env.APP_MODULES+file+'/module')))(error=>
							{
								if(error)
									throw error
							})
							fire--
							if(fire==0)
								return next(null,this.modules)
						})
					else
						return next(null,this.modules)
				})
			})
		}
		catch(error)
		{
			return next(error)
		}
	}
}
module.exports=Loader
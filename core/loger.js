"use strict"
const morgan=require('morgan')
const rfs=require('rotating-file-stream')
const fs=require('fs')
const path=require('path')
class Loger
{
	instance=null
	constructor(config,next)
	{
		try
		{
			if(this.instance)
				return next(false,new Error('Instance already exist'))
			if(process.env.NODE_ENV==='development')
				return next(true,null,morgan('dev'))
			const logDirectory=path.join(__dirname, '../log')
			const options={
				interval:'1d',
				path:logDirectory
			}
			const accessLogStream=rfs.createStream('access.log',options)
			if(!fs.existsSync(logDirectory))
			{
				fs.mkdirSync(logDirectory,{recursive:true})
				return next(true,null,morgan('combined',{stream:accessLogStream}))
			}
			return next(true,null,morgan('combined',{stream:accessLogStream}))
		}
		catch(error)
		{
			return next(false,error)
		}
	}
}
module.exports=Loger
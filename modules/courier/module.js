"use strict"
const Model=require('../../core/model')
const Controller=require('../../core/controller')
class Module
{
	controller={}
	pug={}
	constructor(next)
	{
		try
		{
			const name='courier'
			const options={
				name:name,
				thumbnail:true,
				user:false,
				parent:false,
				url:true,
				schema:
				{
					name:{type:String},
					cost_gr:{type:Number},
					extra_gr:{type:Number},
					cost_cy:{type:Number},
					extra_cy:{type:Number},
				}
			}
			const permitions={
				signUp:false,
				signIn:false,
				signOut:false,
				register:false,
				login:false,
				logout:false,
				find:true,
				findById:true,
				auth_find:true,
				auth_findById:true,
				auth_save:true,
				auth_findByIdAndDelete:true,
				auth_findByIdAndUpdate:true,

				auth_imageUpload:true,
				auth_imageDelete:true
			}
			new Model(options,(error,model,schema)=>
			{
				if(error)
					return next(error)
				new Controller(model,permitions,(error,controller)=>
				{
					if(error)
						return next(error)
					this.controller=controller
					return next(null)
				})
			})
		}
		catch(error)
		{
			return next(error)
		}
	}
	hook(callFunction,req,res,next)
	{
		try
		{
			if(this.controller[callFunction])
				return this.controller[callFunction](req,res,(error,doc,schema)=>
				{
					return next(error,doc,schema)
				})
			return next(new Error("Function unavailable"))
		}
		catch(error)
		{
			return next(error)
		}
	}
}
module.exports=Module
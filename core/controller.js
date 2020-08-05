"use strict"
const mongoose=require('mongoose')
const isValidObjectId=mongoose.isValidObjectId
class Controller
{
	instance=null
	constructor(model,permitions,next)
	{
		try
		{
			const functions={}
			let controller={}
			functions.signUp=model=>
			{
				return (req,res,next)=>{
				}
			}
			functions.signIn=model=>
			{
				return (req,res,next)=>{
				}
			}
			functions.signOut=model=>
			{
				return (req,res,next)=>{
				}
			}
			functions.register=model=>
			{
				return (req,res,next)=>{
				}
			}
			functions.login=model=>
			{
				return (req,res,next)=>{
				}
			}
			functions.logout=model=>
			{
				return (req,res,next)=>{
				}
			}
			functions.find=model=>
			{
				return (req,res,next)=>{
					if(!model)
						throw new Error('Model not set')
					if(!req.body)
						req.body={}
					req.body.where=req.body.where||{}
					req.body.where=true
					return auth_find(req,res,next)
				}
			}
			functions.findById=model=>
			{
				return (req,res,next)=>{
					if(!model)
						throw new Error('Model not set')
					if(!req.body)
						req.body={}
					req.body.where=req.body.where||{}
					req.body.where=true
					return findById(req,res,next)
				}
			}
			functions.auth_find=model=>
			{
				return (req,res,next)=>{
					try
					{
						if(!model)
							throw new Error('Model not set')
						if(!req.body)
							req.body={}
						const select=req.body.select?req.body.select+' -password':'-password'
						const where=req.body.where||{}
						const limit=req.body.limit||{}
						const sort=req.body.sort||{}
						model
						.find(where)
						.limit(limit)
						.sort(sort)
						.select(select)
						.exec()
						.then(doc=>{return next(null,doc)},error=>{return next(error)})
					}
					catch(error)
					{
						return next(error)
					}
				}
			}
			functions.auth_findById=model=>
			{
				return (req,res,next)=>{
					try
					{
						if(!model)
							throw new Error('Model not set')
						if(!req.params._id)
							throw new Error('Record _id not set')
						if(!isValidObjectId(req.params._id))
							throw new Error('No Valid Object Id')
						if(!req.body)
							req.body={}
						const _id=req.params._id
						const select=req.body.select?req.body.select+' -password':'-password'
						const where=req.body.where||{}
						const limit=req.body.limit||{}
						const sort=req.body.sort||{}
						model
						.findById(_id)
						.limit(limit)
						.sort(sort)
						.select(select)
						.exec()
						.then(doc=>{return next(null,doc)},error=>{return next(error)})
					}
					catch(error)
					{
						return next(error)
					}
				}
			}
			functions.auth_save=model=>
			{
				/**
				 *  DEN EXEI TELIWSEI AKOMA AUTO....
				 */
				return (req,res,next)=>{
					if(!model)
						throw new Error('Model not set')
					if(!req.body)
						req.body={}
				}
			}
			functions.auth_findByIdAndUpdate=model=>
			{
				return (req,res,next)=>{
				}
			}
			functions.auth_findByIdAndDelete=model=>
			{
				return (req,res,next)=>{
				}
			}
			const keys=Object.keys(functions)
			keys.forEach(key=>
			{
				if(permitions[key])
					controller[key]=functions[key]()
			})
			return next(null,controller)
		}
		catch(error)
		{
			return next(error)
		}
	}
}
module.exports=Controller
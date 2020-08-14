"use strict"
const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
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
					try
					{
						if(!model)
							throw new Error('Model not set')
						if(!req.body)
							req.body={}
						if(!req.body.data)
							req.body.data={}
						req.body.data.active=false
						return controller['auth_save'](req,res,next,false)
					}
					catch(error)
					{
						return next(error)
					}
				}
			}
			functions.signIn=model=>
			{
				return (req,res,next)=>{
					try
					{
						if(!model)
							throw new Error('Model not set')
						if(!req.body)
							throw new Error('Request body not set')
						if(!req.body.where)
							throw new Error('Request body.where not set')
						if(!req.body.where.email)
							throw new Error('Email not set')
						if(!req.body.where.password)
							throw new Error('Password not set')
						return model.findOne({email:email,active:true},(error,user)=>
						{
							if(error)
								return next(error)
							if(!user)
								return next(new Error('Incorrect Email or Password or account is deactive'))
							return bcrypt.compare(req.body.where.password,user.password,(error,match)=>
							{
								if(error)
									return next(error)
								if(!match)
									return next(new Error('Incorrect Email or Password or account is deactive'))
								let u=user.toObject()
								delete u.password
								u.token=jwt.sign(
								{
									userId:u._id,
									name:model.toString(),
									userName:encodeURIComponent(u.name)
								},
								(process.env.JWT_USER_KEY||"")+model,
								{
									expiresIn:process.env.JWT_USER_TOKEN_EXPIRES||"1h"
								})
								return next(null,u)
							})
						})
					}
					catch(error)
					{
						return next(error)
					}
				}
			}
			functions.signOut=model=>
			{
				return (req,res,next)=>{
					//ONLY FOR USER MANAGER LOG ETC
					return next(null,null)
				}
			}
			functions.register=model=>
			{
				return (req,res,next)=>{
					try
					{
						if(!model)
							throw new Error('Model not set')
						if(!req.body)
							req.body={}
						if(!req.body.data)
							req.body.data={}
						req.body.data.active=false
						return controller['auth_save'](req,res,next,false)
					}
					catch(error)
					{
						return next(error)
					}
				}
			}
			functions.login=model=>
			{
				return (req,res,next)=>{
					try
					{
						if(!model)
							throw new Error('Model not set')
						if(!req.body)
							throw new Error('Request body not set')
						if(!req.body.where)
							throw new Error('Request body.where not set')
						if(!req.body.where.email)
							throw new Error('Email not set')
						if(!req.body.where.password)
							throw new Error('Password not set')
						return model.findOne({email:email,active:true},(error,user)=>
						{
							if(error)
								return next(error)
							if(!user)
								return next(new Error('Incorrect Email or Password or account is deactive'))
							return bcrypt.compare(req.body.where.password,user.password,(error,match)=>
							{
								if(error)
									return next(error)
								if(!match)
									return next(new Error('Incorrect Email or Password or account is deactive'))
								let u=user.toObject()
								delete u.password
								u.token=jwt.sign(
								{
									userId:u._id,
									name:model.toString(),
									userName:encodeURIComponent(u.name)
								},
								(process.env.JWT_ADMIN_KEY||"")+model,
								{
									expiresIn:process.env.JWT_ADMIN_TOKEN_EXPIRES||"1h"
								})
								return next(null,u)
							})
						})
					}
					catch(error)
					{
						return next(error)
					}
				}
			}
			functions.logout=model=>
			{
				return (req,res,next)=>{
					//ONLY FOR USER MANAGER LOG ETC
					return next(null,null)
				}
			}
			functions.find=model=>
			{
				return (req,res,next)=>{
					try
					{
						if(!model)
							throw new Error('Model not set')
						if(!req.body)
							req.body={}
						req.body.where=req.body.where||{}
						req.body.where.active=true
						return controller['auth_find'](req,res,next,false)
					}
					catch(error)
					{
						return next(error)
					}
				}
			}
			functions.findById=model=>
			{
				return (req,res,next)=>{
					try
					{
						if(!model)
							throw new Error('Model not set')
						if(!req.body)
							req.body={}
						req.body.where=req.body.where||{}
						req.body.where.active=true
						return controller['auth_findById'](req,res,next,false)
					}
					catch(error)
					{
						return next(error)
					}
				}
			}
			functions.auth_find=model=>
			{
				return (req,res,next,auth=true)=>{
					try
					{
						if(!model)
							throw new Error('Model not set')
						if(!req.body)
							req.body={}
						const select=req.body.select?req.body.select+' -password':'-password'
						const where=req.body.where||{}
						const limit=req.body.limit||null
						const sort=req.body.sort||null
						return model
						.find(where)
						.limit(limit)
						.sort(sort)
						.select(select)
						.exec((error,doc)=>
						{
							return next(error,doc)
						})
					}
					catch(error)
					{
						return next(error)
					}
				}
			}
			functions.auth_findById=model=>
			{
				return (req,res,next,auth=true)=>{
					try
					{
						if(auth)
						{
							if(!req.body.token)
								throw new Error('Authentication Error (Body Token not Exist)')
							res.code=401
							throw new Error('Authentication Error')
						}
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
						const limit=req.body.limit||null
						const sort=req.body.sort||null
						return model
						.findById(_id)
						.limit(limit)
						.sort(sort)
						.select(select)
						.exec((error,doc)=>
						{
							return next(error,doc)
						})
					}
					catch(error)
					{
						return next(error)
					}
				}
			}
			functions.auth_save=model=>
			{
				return (req,res,next,auth=true)=>{
					try
					{
						if(!model)
							throw new Error('Model not set')
						if(!req.body)
							req.body={}
						if(!req.body.data)
							req.body.dta={}
						if(req.body.data.password)
							req.body.data.password=bcrypt.hashSync(req.body.data.password,bcrypt.genSaltSync(10))
						const record=new module.model(data)
						return record.save((error,doc)=>
						{
							if(error)
								return next(error)
							var d=doc.toObject()
							if(d.password)
								delete d.password
							return next(null,d)
						})
					}
					catch(error)
					{
						return next(error)
					}
				}
			}
			functions.auth_findByIdAndUpdate=model=>
			{
				return (req,res,next,auth=true)=>{
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
						if(!req.body.data)
							req.body.data={}
						if(req.body.data.password)
							req.body.data.password=bcrypt.hashSync(req.body.data.password,bcrypt.genSaltSync(10))
						const options={new:true,select:'-password'}
						return model
						.findByIdAndUpdate(_id,req.body.data,options)
						//.populate('parent')
						.exec((error,doc)=>
						{
							return next(error,doc)
						})
					}
					catch(error)
					{
						return next(error)
					}
				}
			}
			functions.auth_findByIdAndDelete=model=>
			{
				return (req,res,next,auth=true)=>{
					try
					{
						if(!model)
							throw new Error('Model not set')
						if(!req.params._id)
							throw new Error('Record _id not set')
						if(!isValidObjectId(req.params._id))
							throw new Error('No Valid Object Id')
						return model
						.findByIdAndDelete(_id)
						.exec((error,doc)=>
						{
							return next(error,doc)
						})
					}
					catch(error)
					{
						return next(error)
					}
				}
			}
			/**
			 * 	sets functions for controllers
			 */
			const keys=Object.keys(functions)
			keys.forEach(key=>
			{
				if(permitions[key])
					controller[key]=functions[key](model)
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
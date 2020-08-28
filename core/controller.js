"use strict"
const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const sharp=require('sharp')
const fs=require('fs')
const isValidObjectId=mongoose.isValidObjectId
const Storage=require('./storage')
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
								const secretKey=(process.env.JWT_ADMIN_KEY||"")+req.params.model
								u.token=jwt.sign(
								{
									userId:u._id,
									name:req.params.model,
									userName:encodeURIComponent(u.name)
								},
								secretKey,
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
						if(!req.params.model)
							throw new Error('Login model not set')
						return model.findOne({email:req.body.where.email,active:true},(error,user)=>
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
								const secretKey=(process.env.JWT_ADMIN_KEY||"")+req.params.model
								u.token=jwt.sign(
								{
									userId:u._id,
									name:req.params.model,
									userName:encodeURIComponent(u.name)
								},
								secretKey,
								{
									expiresIn:process.env.JWT_ADMIN_TOKEN_EXPIRES||"1h"
								})
								return next(null,u)
							})
						})
					}
					catch(error)
					{
						console.log(error)
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
			functions.auth_check=(req,res,auth,next)=>
			{
				try
				{
					if(!req.body.token)
						throw {name:"Error",message:'body token not exist'}
					const token=req.body.token
					let data=jwt.decode(token)
					if(!data.name)
						throw {name:"Error",message:'Login Model Not set. Token is Corrupted'}
					const  secretKey=(process.env.JWT_ADMIN_KEY||"")+data.name
					return jwt.verify(token,secretKey,(error,decoded)=>
					{
						if(error)
							return res.status(401).json(error)
						return next(null)
					})
				}
				catch(err)
				{
					res.status(401).json(err)
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
				return (req,res,next,auth=true)=>{
					try
					{
						if(!model)
							throw new Error('Model not set')
						if(!req.body)
							req.body={}
						if(error)
							return next(error)
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
						return functions.auth_check(req,res,auth,error=>
						{
							if(error)
								return next(error)
							const select=req.body.select?req.body.select+' -password':'-password'
							const where=req.body.where||{}
							const limit=req.body.limit||null
							const sort=req.body.sort||{order:1}
							return model
							.find(where)
							.limit(limit)
							.sort(sort)
							.select(select)
							.exec((error,doc)=>
							{
								return next(error,doc)
							})
						})
					}
					catch(error)
					{
						console.log(error)
						return next(error)
					}
				}
			}
			functions.auth_findById=model=>
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
						return functions.auth_check(req,res,auth,error=>
						{
							if(error)
								return next(error)
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
				return (req,res,next,auth=true)=>
				{
					try
					{
						if(!model)
							throw new Error('Model not set')
						if(!req.body)
							req.body={}
						if(!req.body.data)
							req.body.dta={}
						return functions.auth_check(req,res,auth,error=>
						{
							if(error)
								return next(error)
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
				return (req,res,next,auth=true)=>
				{
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
						return functions.auth_check(req,res,auth,error=>
						{
							if(error)
								return next(error)
							if(req.body.data.password)
								req.body.data.password=bcrypt.hashSync(req.body.data.password,bcrypt.genSaltSync(10))
							const options={new:true,select:'-password'}
							return model
							.findByIdAndUpdate(req.params._id,req.body.data,options)
							//.populate('parent')
							.exec((error,doc)=>
							{
								return next(error,doc)
							})
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
						return functions.auth_check(req,res,auth,error=>
						{
							if(error)
								return next(error)
							return model
							.findByIdAndDelete(req.params._id)
							.exec((error,doc)=>
							{
								return next(error,doc)
							})
						})
					}
					catch(error)
					{
						return next(error)
					}
				}
			}
			functions.auth_imageUpload=model=>
			{
				return (req,res,next,auth=true)=>
				{
					try
					{
						if(!model)
							throw new Error('Model not set')
						if(!req.params._id)
							throw new Error('Record _id not set')
						if(!req.params.model)
							throw new Error('Record model not set')
						const root='images/'+req.params.model+'/'+req.params._id+'/'
						const name='image'
						return functions.auth_check(req,res,auth,error=>
						{
							if(error)
								return next(error)
							return Storage.instance.save(root,name,(error,upload)=>
							{
								if(error)
									console.log(error)
								return upload(req,res,error=>
								{
									if(error)
										console.log(error)
									if(!req.files||!req.files.image)
										throw new Error('Upload image not exist')
									return model
									.findById(req.params._id)
									.exec((error,doc)=>
									{
										if(error)
											return next(error)
										if(doc._id!=req.params._id)
											return next(new Error('Record id not exist'))
										return functions.sharpImages(req.files.image,(error,images)=>
										{
											if(error)
												return next(error)
											doc.images[doc.images.length]=
											{
												originalname:req.files.image.originalname,
												destination:req.files.image.destination,
												filename:req.files.image.filename,
												path:req.files.image.path,
												thumbnail:
												{
													jpg:
													{
														name:images.jpg.name,
														path:images.jpg.path
													},
													png:
													{
														name:images.png.name,
														path:images.png.path
													},
													webp:
													{
														name:images.webp.name,
														path:images.webp.path
													}
												}
											}
											return model
											.findByIdAndUpdate(req.params._id,doc,{new:true,select:'-password'})
											.exec((error,doc)=>
											{
												if(error)
													return next(error)
												// Kick next after 2sec (need time to resample image to given formats)
												return setTimeout(_=>
												{
													return next(null,doc)
												},2000)
											})
										})
									})
								})
							})
						})
					}
					catch(error)
					{
						return next(error)
					}
				}
			}
			functions.auth_imageDelete=model=>
			{
				return (req,res,next,auth=true)=>
				{
					try
					{
						if(!model)
							throw new Error('Model not set')
						if(!req.params._id)
							throw new Error('Record _id not set')
						if(!req.params.model)
							throw new Error('Record model not set')
						if(!req.params.image_id)
							throw new Error('Record image_id not set')
						return functions.auth_check(req,res,auth,error=>
						{
							if(error)
								return next(error)
							let image2delete=null
							model
							.findById(req.params._id)
							.exec((error,doc)=>
							{
								if(error)
									return next(error)
								if(doc._id!=req.params._id)
									return next(new Error('Record not exist'))
								if(!doc.images||doc.images.length==0)
									return next(new Error('Image Record not exist'))
								doc.images.forEach((e,i)=>
								{
									if(e._id==req.params.image_id)
									{
										image2delete=e
										doc.images.splice(i,1)
									}
								})
								if(!image2delete)
									return next(new Error('Image not exist'))
								return model
								.findByIdAndUpdate(req.params._id,doc,{new:true,select:'-password'})
								.exec((error,doc)=>
								{
									//Not Use return to continue to delete files and folders
									next(error,doc)
									if(image2delete.thumbnail)
									{
										if(fs.existsSync(image2delete.thumbnail.jpg.path))
											fs.unlinkSync(image2delete.thumbnail.jpg.path)
										if(fs.existsSync(image2delete.thumbnail.png.path))
											fs.unlinkSync(image2delete.thumbnail.png.path)
										if(fs.existsSync(image2delete.thumbnail.webp.path))
											fs.unlinkSync(image2delete.thumbnail.webp.path)
										if(fs.existsSync(image2delete.path))
											fs.unlinkSync(image2delete.path)
										let folder=image2delete.path.split('.').splice(0,1).join('')
										setTimeout(_=>
										{
											if(fs.existsSync(folder))
												fs.rmdirSync(folder)
										},2000)
									}
								})
							})
						})
					}
					catch(error)
					{
						return next(error)
					}
				}
			}
			functions.sharpImages=(image,next)=>
			{
				try
				{
					const original=image.path
					const path=image.path.split('.').reverse().splice(1).reverse().join('.')
					const name=image.filename.split('.').reverse().splice(1).reverse().join('')
					const width=parseInt(process.env.IMAGE_MAX_WIDTH)||800
					const heigth=parseInt(process.env.IMAGE_MAX_HEIGHT)||800
					const args={fit:'inside'}
					if(!fs.existsSync(path))
						fs.mkdirSync(path,{recursive:true})
					const outputImages={
						jpg:{
							path:path+'/'+name+'.jpg',
							name:name,
							flaten:{background:{r:255,g:255,b:255,alpha:1}},
							width:width,
							heigth:heigth,
							args:args
						},
						png:{
							path:path+'/'+name+'.png',
							name:name,
							flaten:false,
							width:width,
							heigth:heigth,
							args:args
						},
						webp:{
							path:path+'/'+name+'.webp',
							name:name,
							flaten:false,
							width:width,
							heigth:heigth,
							args:args
						}
					}
					//Resize Base Image
					const keys=Object.keys(outputImages)
					keys.forEach(key=>
					{
						var im=outputImages[key]
						sharp(original)
						.flatten(im.flaten)
						.resize(im.width,im.heigth,im.args)
						.toFile(im.path,(error,info)=>
						{
							if(error)
								console.log(error)
						})
					})
					return next(null,outputImages)
				}
				catch(error)
				{
					next(error)
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
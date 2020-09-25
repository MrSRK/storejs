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
			const name='orders'
			const options={
				name:name,
				thumbnail:true,
				user:false,
				parent:true,
				url:true,
				schema:
				{
					customer:
					{
						name:{type:String},
						surname:{type:String},
						email:{type:String},
						phone:{type:String},
						mobile:{type:String},
						address:
						{
							streat:{type:String},
							zip:{type:String},
							city:{type:String},
							region:{type:String},
							country:{type:String}
						}
					},
					invoice:{type:Boolean},
					invoice_data:
					{
						name:{type:String},
						taxid:{type:String},
						doy:{type:String},
						phone:{type:String},
						address:{type:String}
					},
					items:[
						{
							color:{
								title:{type:String},
								value:{type:String}
							},
							item:{},
							offer:{}
						}
					]
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
				auth_imageDelete:true,
				putOrder:true
			}
			new Model(options,(error,model,schema)=>
			{
				if(error)
					return next(error)
				new Controller(model,permitions,(error,controller)=>
				{
					if(error)
						return next(error)
					// Exception set order function save withoute auth
					controller.putOrder=(req,res,n)=>
					{
						console.log('asdas')
						return controller['auth_save'](req,res,(error,data)=>
						{
							return n(error,data)
						},false)
					}
					console.log(controller)
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
"use strict"
const mongoose=require('mongoose')
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
			const name='product'
			//offer schema
			const offer=mongoose.Schema({
				active:{type:Boolean},
				displayed:{type:Boolean},
				sku:{type:String},
				quantity:{
					min:{type:Number},
					max:{type:Number},
					default:{type:Number},
					step:{type:Number},
				},
				price:{
					original:{type:Number},
					displayed:{type:Number}
				},
				description:{type:String}
			})
			const option=mongoose.Schema({
				active:{type:Boolean},
				title:{type:String},
				value:{type:String}
			})
			//DEF
			const options={
				name:name,
				thumbnail:true,
				user:false,
				parent:false,
				url:false,
				schema:
				{
					mpn:{type:String},
					sku:{type:String},
					name:{type:String},
					category:{type:String,ref:"category",autopopulate:true},
					brand:{type:String,ref:"brand",autopopulate:true},
					supplier:{type:String,ref:"supplier",autopopulate:true},
					title:{type:String},
					description:{type:String},
					vat:{
						min:{type:Number},
						max:{type:Number}
					},
					offers:[offer],
					characteristics:[option],
					color:[option]
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
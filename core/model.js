"use strict"
const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
class Model
{
	instance=null
	constructor(options,next)
	{
		try
		{
			let json={}
			if(options.schema)
				json=options.schema
			if(options.parent)
				json=Object.assign({parent:{type:String,ref:options.name,autopopulate:true}},json)
			if(!json.order)
				json=Object.assign({order:{type:Number}},json)
			if(!json.active)
				json=Object.assign({active:{type:Boolean}},json)
			if(options.url)
				json.url={
					template:{type:String},
					model:{type:String},
					function:{type:String},
					_id:{type:String},
					query:{},
					external:{type:String},
					_blank:{type:Boolean}
				}
			// Image
			if(options.thumbnail)
				json.images=[{
					originalname:{type:String},
					destination:{type:String},
					filename:{type:String},
					path:{type:String},
					thumbnail:{
						jpg:{
							name:{type:String},
							path:{type:String}
						},
						png:{
							name:{type:String},
							path:{type:String}
						},
						webp:{
							name:{type:String},
							path:{type:String}
						}
					}
				}]
			// user Profile
			if(options.user)
			{
				json.name={type:String}
				json.email={type:String},
				json.password={type:String}
			}
			const schema=new mongoose.Schema(json,
			{
				timestamps:true,
				versionKey:false
			})
			schema.plugin(require('mongoose-autopopulate'))
			if(!options.name)
				return next(new Error('Model name not set'))
			return next(null,mongoose.model(options.name,schema),schema)
		}
		catch(error)
		{
			console.log(error)
			return next(error)
		}
	}
}
module.exports=Model
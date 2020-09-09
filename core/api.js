"use strict"
class API
{
	instance=null
    constructor(app,config,next)
    {
        try
        {
			//Image Upload
			app.post('/api/:model/:_id/image',(req,res)=>
			{
				return next(null,'auth_imageUpload',req,res)
			})
			//Image Delete
			app.delete('/api/:model/:_id/image/:image_id',(req,res)=>
			{
				return next(null,'auth_imageDelete',req,res)
			})
			// SignUp
			app.post('/api/:model/signUp',(req,res)=>
			{
				return next(null,'signUp',req,res)
			})
			// SignIn
			app.post('/api/:model/signIn',(req,res)=>
			{
				return next(null,'signIn',req,res)
			})
			// SignOut
			app.post('/api/:model/signOut',(req,res)=>
			{
				return next(null,'signOut',req,res)
			})
			// Register
			app.post('/api/:model/register',(req,res)=>
			{
				return next(null,'register',req,res)
			})
			// Login
			app.post('/api/:model/login',(req,res)=>
			{
				return next(null,'login',req,res)
			})
			// Logout
			app.post('/api/:model/logout',(req,res)=>
			{
				return next(null,'logout',req,res)
			})
			// List
			app.get('/api/:model',(req,res)=>
			{
				return next(null,'find',req,res)
			})
			// Show
			app.get('/api/:model/:_id',(req,res)=>
			{
				return next(null,'findById',req,res)
			})
			// Table
			app.post('/api/:model/',(req,res)=>
			{
				return next(null,'auth_find',req,res)
			})
			// Edit
			app.post('/api/:model/:_id',(req,res)=>
			{
				return next(null,'auth_findById',req,res)
			})
			// Insert
			app.put('/api/:model/',(req,res)=>
			{
				return next(null,'auth_save',req,res)
			})
			// Delete
			app.delete('/api/:model/:_id',(req,res)=>
			{
				return next(null,'auth_findByIdAndDelete',req,res)
			})
			// Update
			app.patch('/api/:model/:_id',(req,res)=>
			{
				return next(null,'auth_findByIdAndUpdate',req,res)
			})
			// Default
			app.all('/api',(req,res)=>
			{
				return res.status(200).send({status:true,message:'Welcome to API'})
			})
			// 404 message
			app.all('/api*',(req,res)=>
			{
				return res.status(404).send({status:false,message:'API route not exist (404)'})
			})
        }
        catch(error)
        {
			return next(false,error)
        }
	}
	postMessage(res,error,doc,schema)
	{
		if(schema)
		{
			schema.push('createdAt')
			schema.push('updatedAt')
		}
		if(error)
			return res.status(res.code||500).json({
				status:false,
				doc:null,
				error:error.message
			})
		return res.status(res.code||200).json({
			status:true,
			doc:doc,
			schema:schema,
			error:null
		})
	}
}
module.exports=API
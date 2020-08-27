"use strict"
const dotenv=require('dotenv')
const express=require('express')
const chalk=require('chalk')
const Config=require('./core/config')
const Errorhandler=require('./core/errorhandler')
const Loger=require('./core/loger')
const Database=require('./core/database')
const Cookie=require('./core/cookie')
const Session=require('./core/session')
const Security=require('./core/security')
const Parser=require('./core/parser')
const Sass=require('./core/sass')
const Storage=require('./core/storage')
const Router=require('./core/router')
const Websocket=require('./core/websocket')
const API=require('./core/api')
const Loader=require('./core/loader')
try
{
	dotenv.config()
	const config=new Config()
	const app=express()
	let app_modules=[]
	/*
	* Load Core Modules
	*/
	/**
	 * Error Report Formater (Dev)
	 */
	Errorhandler.instance=new Errorhandler(config,(status,error,module)=>
	{
		if(error)
			console.log(error)
		if(status)
			app.use(module)
	})
	/**
	 * Error loger (Dev / Prod)
	 */
	Loger.instance=new Loger(config,(status,error,module)=>
	{
		if(error)
			console.log(error)
		if(status)
			app.use(module)
	})
	/**
	 * Database Handler
	 */
	Database.instance=new Database(config,(status,error,module)=>
	{
		if(error)
			console.log(error)
		//if(status)
			//app.use(module)
	})
	/**
	 * Cookie Handler
	 */
	Cookie.instance=new Cookie(config,(status,error,module)=>
	{
		if(error)
			console.log(error)
		if(status)
			app.use(module)
	})
	/**
	 * Session Handler
	 */
	Session.instance=new Session(config,(status,error,module)=>
	{
		if(error)
			console.log(error)
		if(status)
			app.use(module)
	})
	/**
	 * Security (XSS etc) Handler

	Security.instance=new Security(config,(status,error,module)=>
	{
		if(error)
			console.log(error)
		if(status)
			app.use(module)
	})*/
	/**
	 * Body URL parser
	 */
	Parser.instance=new Parser(config,(status,error,module)=>
	{
		if(error)
			console.log(error)
		if(status)
			app.use(module)
	})
	/**
	 * CSS SASS Handler
	 */
	Sass.instance=new Sass(config,(status,error,module)=>
	{
		if(error)
			console.log(error)
		if(status)
			app.use(module)
	})
	/**
	 * Storage (file upload / Multer) Handler
	 */
	Storage.instance=new Storage(config,(status,error,module)=>
	{
		if(error)
			console.log(error)
		//if(status)
			//app.use(module)
	})
	/**
	 * Load App Modules
	 */
	Loader.instance=new Loader(app,config,(error,modules)=>
	{
		if(error)
			console.log(error)
		app_modules=modules
	})
	/**
	 * API Routs Handler
	 */
	API.instance=new API(app,config,(error,callFunction,req,res)=>
	{
		if(error)
			return API.instance.postMessage(res,error)
		if(req.params.model&&app_modules[req.params.model])
			return app_modules[req.params.model].hook(callFunction,req,res,(error,doc)=>
			{
				if(error)
					return API.instance.postMessage(res,error)
				return API.instance.postMessage(res,null,doc)
			})
		return API.instance.postMessage(res,new Error('Unknown model'))
	})
	/**
	 * Websocket Handler
	 */
	Websocket.instance=new Websocket(app,config,(error,request,response)=>
	{
		if(error)
			return Websocket.instance.postMessage(request,response,error)
		if(!request.params||!request.params.model)
			return Websocket.instance.postMessage(request,response,{name:"Error",message:"Unknown model"})
		if(app_modules[request.params.model])
			return app_modules[request.params.model].hook(request.params.function,request,response,(error,doc)=>
			{
				if(error)
					return Websocket.instance.postMessage(request,response,error)
				Websocket.instance.postMessage(request,response,null,doc)
			})
		else
			return Websocket.instance.postMessage(request,response,{name:"Error",message:"Unknown model"})
	})
	/**
	 * Pug Routs Handler
	 */
	Router.instance=new Router(config,(status,error,module)=>
	{
		if(error)
			console.log(error)
		if(status)
			app.use(module)
	})
	/**
	 * Application listening Port
	 */
	app.listener=app.listen(process.env.APP_PORT,process.env.APP_HOST,error=>
	{
		if(error)
		{
			console.log(error)
			process.exit(1)
		}
		console.log('%s %s',chalk.red('#'),chalk.blue("Application is Running... "))
		console.log(chalk.bgRed('Listening at: http://%s%s '),app.listener.address().address,app.listener.address().port!=80?':'+app.listener.address().port:'')
	})
}
catch(error)
{
	console.log(error)
}
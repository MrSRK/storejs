"use strict"
const express=require('express')
const path=require('path')
class Router
{
    instance=null
    constructor(config,next)
    {
        try
        {
			const router=express.Router()
          	/**
			 * Adding Static routes tou public app router
			 */
			config.routes.forEach(r=>
			{
				router.use(r.route,express.static(path.join(__dirname,'../'+r.src),{maxAge:parseInt(process.env.FILE_MAXAGE)}))
			})
			/**
			 * Pug Routes
			 */
			config.pug.forEach(pug=>
			{
				router.get(pug.route,(req,res)=>
				{
					pug.model=req.params.model||'home'
					return res.status(200).render(pug.view,pug)
				})
			})
			/**
			 * Default 404 Image Fall back route
			 */
			router.use('/images*',express.static(path.join(__dirname,'../public/images/404.png'),{maxAge:10}))
			/**
			 * Default 404 Fall back route
			 */
			router.all('*',(req,res)=>
			{
				return res.status(404).render('404')
			})
			return next(true,null,router)
        }
        catch(error)
        {
            return next(false,error)
        }
    }
}
module.exports=Router
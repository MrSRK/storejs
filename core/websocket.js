"use strict"
const expressws=require('express-ws')
class Websocket
{
	instance=null
    constructor(app,config,next)
    {
        try
        {
            expressws(app)
            const wspath='/socket'
            app.ws(wspath,(ws,req)=>
			{
                ws.send(JSON.stringify({service:'server',status:true,error:null,message:'Wellcome to API'}))
				ws.on('message',msg=>
				{
                    try
                    {
                        const data=JSON.parse(msg)
                        return next(null,data,response=>
                        {
                            return ws.send(JSON.stringify(response))
                        })
                    }
                    catch(error)
                    {
                        ws.send(JSON.stringify({service:'server',status:false,code:500,message:error.toString()}))
                        return next(error,null,response=>
                        {
                            return ws.send(JSON.stringify(response))
                        })
                    }
				})
				ws.on('close',()=>
				{
                    return ws.terminate()
				})
            })
            app.ws('*',(ws,req)=>
            {
                ws.send(JSON.stringify({service:'server',status:false,code:404,message:'Unsaported Path'}))
                return ws.terminate()
            })
        }
        catch(error)
        {
            console.log(error)
        }
	}
	postMessage(request,response,error,doc)
	{
		if(!request)
			request={}
		if(!request.params)
			request.params={}
		if(error)
			return response({
				status:false,
				params:{
					model:request.params.model||null,
					function:request.params.function||null
				},
				doc:null,
				error:error
			})
		return response({
			status:true,
			params:{
				model:request.params.model||null,
				function:request.params.function||null
			},
			doc:doc,
			error:null
		})
	}
}
module.exports=Websocket
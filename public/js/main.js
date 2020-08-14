"use strict"
const app=angular.module("app",[])
app.controller("page-handler",['$scope','$http',($scope,$http)=>
{
	// Request Functions
	const request={}
	// Data handle functions
	const handle={}
	// Scope content (data) Container
	const content={}
	const build={}
	request.list=model=>
	{
		try
		{
			$http
			.get('/api/'+model)
			.then(resp=>{
				if(resp.data)
					return handle.list(model,resp.data)
				return handle.error(model,'list',resp)
			},
			error=>
			{
				console.log(error)
				return handle.error(model,'list',error)
			})
		}
		catch(error)
		{
			console.log(error)
		}
	}
	handle.list=(model,data)=>
	{
		try
		{
			if(!data.status)
				return handle.error(model,'list',data)
			if(!data.doc)
				return handle.error(model,'list',data)
			if(!content[model])
				content[model]={}
			content[model].list=data.doc
			return true
		}
		catch(error)
		{
			console.log(error)
			return false
		}
	}
	//#################################
	handle.error=(model,data)=>
	{
		try
		{

		}
		catch(error)
		{
			console.log(error)
		}
	}
	//#####################################
	build.defimgsrc=(model,rec)=>
	{
		return  '/upload/images/'+model+"/"+rec._id+"/"+rec.images[0].filename
	}
	$scope.request=request
	$scope.handle=handle
	$scope.content=content
	$scope.build=build
}])
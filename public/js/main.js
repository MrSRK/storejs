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
	const admin={}
	const options={}
	admin
	admin.getObjectKeys=obj=>
	{
		return Object.keys(obj)
	}
	admin.tableMassCheck=model=>
	{
		content[model].table.forEach(rec=>
		{
			rec.tmp={checked:!options.tableMassCheck||false}
		})
	}
	admin.tableMassActive=(model,value)=>
	{
		content[model].table.forEach(rec=>
		{
			if(rec.tmp&&rec.tmp.checked)
				admin.active(model,rec,value)
		})
		options.tableMassCheck=false
	}
	admin.tableMassDelete=(model,value)=>
	{
		let ans=confirm('~~~ Προσοχή! ~~~\nΔιαδικασία μαζικής Διαγραφής…\nΕίστε σίγουρος ότι θέλετε να διαγράψετε ΟΡΙΣΤΙΚΑ τις επιλεγμένες εγγραφές;')
		if(ans)
		{
			content[model].table.forEach(rec=>
			{
				if(rec.tmp&&rec.tmp.checked)
					admin.deleteByid(model,rec,false)
			})
			options.tableMassCheck=false
		}
	}
	admin.active=(model,rec,forse)=>
	{
		if(forse!=null)
			rec.active=forse
		else
			rec.active=!rec.active
		return admin.updateByid(model,rec)
	}
	admin.addOrder=(model,rec,value)=>
	{
		rec.order=parseInt(rec.order||0)+parseInt(value)
		return admin.updateByid(model,rec)
	}
	admin.setSort=col=>
	{
		if(options.sort.name==col)
			options.sort.reverse=!options.sort.reverse
		else
			options.sort={name:col,reverse:false}
	}
	admin.getPages=(len,lim)=>
	{
		let ret=[]
		let l=0;
		l=Math.ceil(len/lim)
		for(let i=0;i<l;i++)
		{
			console.log("try to: "+(lim*i))
			ret[i]=lim*i
		}
		return ret
	}
	admin.updateByid=(model,rec)=>
	{
		rec.tmp={disabled:true}
		return $http.patch('/api/'+model+'/'+rec._id,{data:rec})
		.then(resp=>{
			if(!resp.data.doc)
				return console.log('Error: Update Return emty doc')
			$scope.content[model].table.forEach((e,i)=>
			{
				if(e._id==resp.data.doc._id)
				{
					resp.data.doc.tmp={disabled:false}
					$scope.content[model].table[i]=resp.data.doc
				}

			})
		},
		error=>
		{
			console.log(error)
		})
	}
	admin.deleteByid=(model,rec,inform=true)=>
	{
		rec.tmp={disabled:true}
		let ans=true
		if(inform)
			ans=confirm('~~~ Προσοχή! ~~~\nΔιαδικασία Διαγραφής…\nΕίστε σίγουρος ότι θέλετε να διαγράψετε ΟΡΙΣΤΙΚΑ αυτήν την εγγραφή;')
		if(ans)
			return $http.delete('/api/'+model+'/'+rec._id)
			.then(resp=>{
				$scope.content[model].table.forEach((e,i)=>
				{
					if(e._id==rec._id)
						$scope.content[model].table.splice(i,1)
				})
			},
			error=>
			{
				console.log(error)
			})
		else
			rec.tmp={disabled:false}
	}
	request.edit=(model,_id)=>
	{
		try
		{
			$http
			.post('/api/'+model+'/'+_id)
			.then(resp=>{
				if(resp.data)
					return handle.edit(model,resp.data)
				return handle.error(model,'edit',resp)
			},
			error=>
			{
				console.log(error)
				return handle.error(model,'table',error)
			})
		}
		catch(error)
		{
			console.log(error)
		}
	}
	request.table=model=>
	{
		try
		{
			$http
			.post('/api/'+model)
			.then(resp=>{
				$scope.options={
					sort:{
						name:'order',
						reverse:false
					},
					limit:
					{
						limit:100,
						begin:0
					}
				}
				if(resp.data)
					return handle.table(model,resp.data)
				return handle.error(model,'table',resp)
			},
			error=>
			{
				console.log(error)
				return handle.error(model,'table',error)
			})
		}
		catch(error)
		{
			console.log(error)
		}
	}
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
	handle.table=(model,data)=>
	{
		try
		{
			if(!data.status)
				return handle.error(model,'table',data)
			if(!data.doc)
				return handle.error(model,'table',data)
			if(!content[model])
				content[model]={}
			content[model].table=data.doc
			return true
		}
		catch(error)
		{
			console.log(error)
			return false
		}
	}
	handle.edit=(model,data)=>
	{
		try
		{
			if(!data.status)
				return handle.error(model,'edit',data)
			if(!data.doc)
				return handle.error(model,'edit',data)
			if(!content[model])
				content[model]={}
			content[model].edit=data.doc
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
	$scope.admin=admin
	$scope.options=options
}])
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
	let inArrayValues=[]
	admin.inArray=(value,array)=>
	{
		inArrayValues=inArrayValues.concat(array)
		return array.includes(value)
	}
	admin.notInAllArray=value=>
	{
		return !inArrayValues.includes(value)
	}
	admin.getObjectKeys=obj=>
	{
		return Object.keys(obj)
	}
	admin.tableMassCheck=model=>
	{
		content[model].table.forEach(rec=>
		{
			rec.tmp={checked:!$scope.options.tableMassCheck||false}
		})
	}
	admin.tableMassActive=(model,value)=>
	{
		content[model].table.forEach(rec=>
		{
			if(rec.tmp&&rec.tmp.checked)
				admin.active(model,rec,value)
		})
		$scope.options.tableMassCheck=false
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
			$scope.options.tableMassCheck=false
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
		if(!$scope.options.sort)
			$scope.options.sort={}
		if($scope.options.sort.name==col)
			$scope.options.sort.reverse=!$scope.options.sort.reverse
		else
			$scope.options.sort={name:col,reverse:false}
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
	admin.updateByid=(model,rec,redirect=false)=>
	{
		rec.tmp={disabled:true}
		if(rec.password==null||rec.password=='')
			delete rec.password
		return $http.patch('/api/'+model+'/'+rec._id,{data:rec})
		.then(resp=>{
			if(!resp.data.doc)
				return console.log('Error: Update Return emty doc')
			if(redirect)
				return window.location.href="/administrator/"+model
			return $scope.content[model].table.forEach((e,i)=>
			{
				if(e._id==resp.data.doc._id)
				{
					resp.data.doc.tmp={disabled:false}
					$scope.content[model].table[i]=resp.data.doc
				}
			})
		},
		error=>
		{lo
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
			return $http
			.delete('/api/'+model+'/'+rec._id)
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
	admin.deleteImage=(model,rec,image)=>
	{
		$scope.content[model].edit.tmp={disabled:true}
		return $http.delete('/api/'+model+'/'+rec._id+'/image/'+image._id)
		.then(resp=>{
			if(resp.data&&resp.data.status)
				$scope.content[model].edit.images.forEach((e,i)=>
				{
					if(e._id==image._id)
						$scope.content[model].edit.images.splice(i,1)
					$scope.content[model].edit.tmp.disabled=false
				})
		},
		error=>
		{
			$scope.content[model].edit.tmp.disabled=false
			console.log(error)
		})
	}
	admin.addImage=(model,_id,element)=>
	{
		$scope.content[model].edit.tmp={disabled:true}
		const data=new FormData()
		data.append('image',$(element)[0].files[0])
		return jQuery.ajax(
		{
			url: '/api/'+model+'/'+_id+'/image/',
			type:'POST',
			data: data,
			contentType: false,
			processData: false,
			success:response=>
			{
				if(response.status)
				{
					$scope.content[model].edit.images=response.doc.images
					$scope.content[model].edit.tmp.disabled=false
					$scope.$apply()
				}
				else
					$scope.content[model].edit.tmp.disabled=false
			},
			error:(jqXHR,textStatus,errorMessage)=>
			{
				$scope.content[model].edit.tmp.disabled=false
				if(jqXHR.responseText)
				{
					resp=JSON.parse(jqXHR.responseText)
				}
				alert('Error uploading: ' + errorMessage)
			}
		})
	}
	//########################################
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
	//####################################
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
		return  '/img/'+model+"/"+rec._id+"/"+rec.images[0].filename
	}
	$scope.request=request
	$scope.handle=handle
	$scope.content=content
	$scope.build=build
	$scope.admin=admin
	$scope.options=options
}])
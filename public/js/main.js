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
	const user={}
	const options={}
	let inArrayValues=[]
	user.buildNavigationLink=nav=>
	{
		let href='/'
		if(!nav||!nav.url)
			return '#'
		if(nav.url.external&&nav.url.external!='')
			return nav.url.external
		if(!nav.url.model)
			return href
		href+=nav.url.model
		if(!nav.url.function&&!nav.url._id)
			return href
		if(!nav.url._id)
			return href+'/'+nav.url.function
		return href+'/'+nav.url.function+'/'+nav.url._id
	}
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
	admin.save=(model,rec,redirect=false)=>
	{
		if(!content[model])
			content[model]={new:{}}
		rec.tmp={disabled:true}
		return $ahttp
		.put('/api/'+model+'/',{data:rec},(error,resp)=>
		{
			if(error)
			{
				console.log(error)
				return false
			}
			if(!resp.data.doc)
				return console.log('Error: Update Return emty doc')
			if(redirect)
				return window.location.href="/administrator/"+model+"/"+resp.data.doc._id
		})
	}
	admin.updateByid=(model,rec,redirect=false)=>
	{
		rec.tmp={disabled:true}
		if(rec.password==null||rec.password=='')
			delete rec.password
		return $ahttp
		.patch('/api/'+model+'/'+rec._id,{data:rec},(error,resp)=>
		{
			if(error)
			{
				console.log(error)
				return false
			}
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
		})
	}
	admin.deleteByid=(model,rec,inform=true)=>
	{
		rec.tmp={disabled:true}
		let ans=true
		if(inform)
			ans=confirm('~~~ Προσοχή! ~~~\nΔιαδικασία Διαγραφής…\nΕίστε σίγουρος ότι θέλετε να διαγράψετε ΟΡΙΣΤΙΚΑ αυτήν την εγγραφή;')
		if(ans)
			return $ahttp
			.delete('/api/'+model+'/'+rec._id,(error,resp)=>
			{
				if(error)
				{
					console.log(error)
					return false
				}
				$scope.content[model].table.forEach((e,i)=>
				{
					if(e._id==rec._id)
						$scope.content[model].table.splice(i,1)
				})
			})
		else
			rec.tmp={disabled:false}
	}
	admin.deleteImage=(model,rec,image)=>
	{
		$scope.content[model].edit.tmp={disabled:true}
		return $ahttp
		.delete('/api/'+model+'/'+rec._id+'/image/'+image._id,(error,resp)=>
		{
			if(error)
			{
				console.log(error)
				return false
			}
			if(resp.data&&resp.data.status)
				$scope.content[model].edit.images.forEach((e,i)=>
				{
					if(e._id==image._id)
						$scope.content[model].edit.images.splice(i,1)
					$scope.content[model].edit.tmp.disabled=false
				})
		})
	}
	admin.addImage=(model,_id,element)=>
	{
		$scope.content[model].edit.tmp={disabled:true}
		const token=admin.user().token
		const data=new FormData()
		data.append('image',$(element)[0].files[0])
		return jQuery.ajax(
		{
			url: '/api/'+model+'/'+_id+'/image/?token='+token,
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
					let resp=JSON.parse(jqXHR.responseText)
				}
				alert('Error uploading: ' + errorMessage)
			}
		})
	}
	admin.login=_=>
	{
		return $ahttp
		.post('/api/administrator/login',{where:$scope.user},(error,resp)=>
		{
			if(error||!resp.data||!resp.data.status||!resp.data.doc)
			{
				console.log(error)
				return false
			}
			admin.user(resp.data.doc)
			window.location.href="/administrator"
		})
	}
	admin.logout=_=>
	{
		localStorage.clear();
		window.location.href='/administrator/login'
	}
	admin.user=user=>
	{
		try
		{
			if(user)
				localStorage.setItem('user',JSON.stringify(user))
			let storage=localStorage.getItem('user')
			if(!storage)
				storage='{"token":null}'
			return JSON.parse(storage)
		}
		catch(error)
		{
			console.log(error)
			let storage=localStorage.getItem('user')
			if(!storage)
				storage='{"token":null}'
			return JSON.parse(storage)
		}
	}
	//########################################
	request.edit=(model,_id)=>
	{
		try
		{
			$ahttp
			.post('/api/'+model+'/'+_id,{},(error,resp)=>
			{
				if(error)
					return handle.error(model,'table',error)
				if(resp.data)
					return handle.edit(model,resp.data)
				return handle.error(model,'edit',resp)
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
			$ahttp
			.post('/api/'+model,null,(error,resp)=>
			{
				if(error&&error.status==401)
					return admin.logout() //Clear user data and go to login page
				if(error)
					return handle.error(model,'table',resp)
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
			.get('/api/'+model,null,(error,resp)=>
			{
				if(error)
					return handle.error(model,'list',resp)
				if(resp.data)
					return handle.list(model,resp.data)
			})
		}
		catch(error)
		{
			console.log(error)
		}
	}
	request.navigation=_=>
	{
		try
		{
			let nav=sessionStorage.getItem('navigation')
			if(nav&&nav!='')
				return content.navigation=JSON.parse(nav)
			$ahttp
			.get('/api/navigation',null,(error,resp)=>
			{
				if(error)
					return console.log(error)
				if(!resp.data||!resp.data.doc)
					return console.log('Empty Navigation menu')
				resp.data.doc.forEach((e,i)=>
				{
					if(e.parent)
					{
						resp.data.doc.forEach((ee,ii)=>
						{
							if(ee._id==e.parent._id)
								resp.data.doc.splice(i,1)
							if(!resp.data.doc[ii].child)
								resp.data.doc[ii].child=[]
							resp.data.doc[ii].child.push(e)
						})
					}
				})
				content.navigation=resp.data.doc
				console.log(content.navigation)
				//sessionStorage.setItem('navigation',JSON.stringify(resp.data.doc))
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
			content[model].schema=data.schema
			return true
		}
		catch(error)
		{
			console.log(error)
			return false
		}
	}
	//#################################
	handle.error=(model,functions,data)=>
	{
		try
		{
			console.log("Try to error set")
			console.log(data)
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

	//Wrappers
	const $ahttp={}
	$ahttp.get=(url,data,next)=>
	{
		const token=admin.user().token
		if(!data)
			data={}
		data.token=token
		return $http
		.get(url,data)
		.then(resp=>{return next(null,resp)},error=>{return next(error)})
	}

	$ahttp.put=(url,data,next)=>
	{
		const token=admin.user().token
		if(!data)
			data={}
		data.token=token
		return $http
		.put(url,data)
		.then(resp=>{return next(null,resp)},error=>{return next(error)})
	}
	$ahttp.post=(url,data,next)=>
	{
		const token=admin.user().token
		if(!data)
			data={}
		data.token=token
		return $http
		.post(url,data)
		.then(resp=>{return next(null,resp)},error=>{return next(error)})
	}
	$ahttp.patch=(url,data,next)=>
	{
		const token=admin.user().token
		if(!data)
			data={}
		data.token=token
		return $http
		.patch(url,data)
		.then(resp=>{return next(null,resp)},error=>{return next(error)})
	}
	$ahttp.delete=(url,next)=>
	{
		const token=admin.user().token
		return $http
		.delete(url+'?token='+token)
		.then(resp=>{return next(null,resp)},error=>{return next(error)})
	}


	$scope.request=request
	$scope.handle=handle
	$scope.content=content
	$scope.build=build
	$scope.admin=admin
	$scope.user=user
	$scope.options=options
}])
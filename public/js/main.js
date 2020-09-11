"use strict"
const app=angular.module("app",[])
//	Filter
app.controller("page-handler",['$scope','$http',($scope,$http)=>
{
	$scope.cart={}
	$scope.productListFilter=(items,v1,v2)=>
	{
		console.log('RUNNING FRO M SCOPE')
		console.log(items)
		console.log(v1)
		console.log(v2)
		console.log('--------------------------------------------------------------')

		return null
	}
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
	const page={}
	let inArrayValues=[]
	const author={
		"@context": "https://schema.org",
		"@type": "LocalBusiness",
		"currenciesAccepted": "EUR",
		"paymentAccepted":"Cash, Credit Card",
		"address":
		{
			"@type":"PostalAddress",
			"addressCountry":"GR",
			"addressLocality":"Ηράκλειο Κρήτης",
			"postalCode":"71304",
			"streetAddress":"Στρυμώνος 11"
		},
		"email":"info@saloras.gr",
		"telephone":"281 037 2800",
		"description": "Είμαστε η πρώτη εταιρία που από την ίδρυση της ασχολήθηκε με τις δορυφορικές επικοινωνίες (Πρώτη δορυφορική λήψη στην ΚΡΗΤΗ την 30-06-85) εφήρμοσε την παράλληλη διανομή τηλεοπτικών, μουσικών και πληροφοριακών (μέσω υπολογιστή)  καναλιών, με πρώτη μεγάλη εγκατάσταση το 1989 στο CRETA PALACE της GRECOTEL στο ΡΕΘΥΜΝΟ.",
		"name": "Saloras Satellite Center",
		"openingHours": "Mo-Sa 09:00-21:00",
		"priceRange":"$$$",
		"image":"https://www.saloras.gr/images/logo-banner.svg"
	}
	user.addCart=_=>
	{
		if(!$scope.cart)
			return false
		let cart=sessionStorage.getItem('cart')
		if(!cart)
			cart='[]'
		cart=JSON.parse(cart)
		cart.push($scope.cart)
		sessionStorage.setItem('cart',JSON.stringify(cart))
		$('#cartInform').modal('toggle')
	}
	user.cartOffer=offers=>
	{
		let newOffer=$scope.cart.offer
		if($scope.cart.quantity<$scope.cart.offer.quantity.min)
		{
			let newMin=0
			newOffer=$scope.cart.offer
			offers.forEach(e=>
			{
				e.quantity.min=parseInt(e.quantity.min)
				if(e.quantity.min>=0)
				{}
				else
					e.quantity.min=0
				if(e.quantity.min<=$scope.cart.quantity&&e.quantity.min<$scope.cart.offer.quantity.min&&e.quantity.min>=newMin)
				{
					newMin=e.quantity.min
					newOffer=e
				}
			})
			$scope.cart.offer=newOffer
		}
		if($scope.cart.quantity>$scope.cart.offer.quantity.max)
		{
			let newMax=Infinity
			newOffer=$scope.cart.offer
			offers.forEach(e=>
			{
				e.quantity.max=parseInt(e.quantity.max)
				if(e.quantity.max>=0)
				{}
				else
					e.quantity.max=Infinity
				if(e.quantity.max>=$scope.cart.quantity&&e.quantity.max>$scope.cart.offer.quantity.max&&e.quantity.max<=newMax)
				{
					newMax=e.quantity.max
					newOffer=e
				}
			})
			$scope.cart.offer=newOffer
		}
	}
	user.cartSetMax=offers=>
	{
		let max=0
		offers.forEach(e=>
		{
			if(e.quantity.max>max)
				max=e.quantity.max
			if(!e.quantity.max)
				max=Infinity
		})
		return max
	}
	user.cartSetMin=offers=>
	{
		let min=Infinity
		offers.forEach(e=>
		{
			if(e.active&&e.displayed)
			{
				if(e.quantity.min<min)
					min=e.quantity.min
				if(!e.quantity.min)
					min=0
			}
		})
		return min
	}
	user.setCartQuantity=quantity=>
	{
		$scope.cart.quantity=quantity
	}
	user.minOffer=offer=>
	{
		let ret=Infinity;
		offer.forEach(e=>
		{
			if(e.price.displayed&&e.price.displayed<ret)
				ret=e.price.displayed
		})
		if(ret==Infinity)
			ret='-'
		return ret
	}
	user.minOfferOriginal=offer=>
	{
		let ret=null;
		let displayed=Infinity
		offer.forEach(e=>
		{
			if(e.price.displayed&&e.price.displayed<displayed)
			{
				displayed=e.price.displayed
				ret=e.price.original
			}
		})
		return ret
	}
	user.translateHead=text=>
	{
		const translate={
			articles:"σχετικά άρθρα",
			works:"δουλειές μας",
			products:"Προϊόντα"
		}
		return translate[text]||text
	}
	user.nl2br=(text)=>
	{
		console.log(text)
		const t= text.split('\n')
		console.log(t)
		return t
	}
	user.schemaListBuilder=(model,data)=>
	{
		try
		{
			let ret=[]
			data.forEach((e,i)=>
			{
				ret.push(user.schemaBuilder(model,e,false))
			})
			user.schema=ret
			return true
		}
		catch(error)
		{
			console.log(error)
			return false
		}
	}
	user.schemaBuilder=(model,rec,set=false)=>
	{
		try
		{
			let ret={}
			if(model=='article')
			{
				ret["@context"]="http://schema.org/"
				ret["@type"]="Article"
				ret["name"]=rec.name||null
				ret["headline"]=rec.title || rec.name||null
				ret["description"]=rec.description||null
				ret["url"]=window.location.origin+'/'+model+'/'+rec._id
				if(rec.images)
				{
					ret["image"]=[]
					rec.images.forEach((e,i)=>
					{
						ret["image"].push(window.location.origin+'/thumbnail/'+model+'/'+rec._id+'/'+e.thumbnail.webp.name+'/'+e.thumbnail.webp.name+'.webp')
						ret["image"].push(window.location.origin+'/thumbnail/'+model+'/'+rec._id+'/'+e.thumbnail.png.name+'/'+e.thumbnail.webp.name+'.png')
						ret["image"].push(window.location.origin+'/thumbnail/'+model+'/'+rec._id+'/'+e.thumbnail.jpg.name+'/'+e.thumbnail.webp.name+'.jpg')
					})
				}
			}
			if(set)
				user.schema=ret
			return ret
		}
		catch(error)
		{
			console.log(error)
			return {}
		}
	}
	user.buildNavigationLink=nav=>
	{
		let href='/'
		if(!nav||!nav.url)
			return '/#'
		if(nav.url.external&&nav.url.external!='')
			return nav.url.external
		if(!nav.url.model)
			return href
		href+=nav.url.model
		if(nav.url.function&&nav.url.function!='')
			href+='/'+nav.url.function
		if(nav.url._id&&nav.url._id!='')
			href+='/'+nav.url._id
		return href
	}
	admin.editAddSubItem=(model,col,item)=>
	{
		if(!content[model].edit[col])
			content[model].edit[col]=[]

		item=JSON.parse(item)
		content[model].edit[col].push({_id:item._id,images:item.images,title:item.title})
		return null
	}
	admin.viewTemplateLoader=(func,model,_id)=>
	{
		//	/template/edit.html?model="+model+"&_id="+_id+"
		const specific='/template/'+func+'-'+model+'.html?model='+model+'&_id='+_id
		const global='/template/'+func+'.html?model='+model+'&_id='+_id
		$scope.teplates=[]
		$http
		.get(specific)
		.then(resp=>{
			$scope.teplates=[specific,global]
			$scope.viewTemplate=$scope.teplates[0]
		},error=>{
			$scope.teplates=[global]
			$scope.viewTemplate=$scope.teplates[0]
		})
		return true
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
			ret[i]=lim*i
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
	request.list=(model,sticky=false,filters=[])=>
	{
		try
		{
			let args={}
			if(sticky)
				args={where:{sticky:true}}
			$ahttp
			.get('/api/'+model,args,(error,resp)=>
			{
				if(error)
					return handle.error(model,'list',resp)
				if(resp.data)
					return handle.list(model,resp.data,filters)
			})
		}
		catch(error)
		{
			console.log(error)
		}
	}
	request.show=(model,_id)=>
	{
		try
		{
			let args={}
			$ahttp
			.get('/api/'+model+'/'+_id,args,(error,resp)=>
			{
				if(error)
					return handle.error(model,'show',resp)
				if(resp.data)
					return handle.show(model,resp.data)
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
						resp.data.doc.forEach((ee,ii)=>
						{
							if(ee._id==e.parent._id)
							{
								resp.data.doc.splice(i,1)
								if(!resp.data.doc[ii].child)
									resp.data.doc[ii].child=[]
								resp.data.doc[ii].child.push(e)
							}
						})
				})
				content.navigation=resp.data.doc
				sessionStorage.setItem('navigation',JSON.stringify(resp.data.doc))
			})
		}
		catch(error)
		{
			console.log(error)
		}
	}
	//####################################
	handle.list=(model,data,filters)=>
	{
		try
		{
			if(!data.status)
				return handle.error(model,'list',data)
			if(!data.doc)
				return handle.error(model,'list',data)
			if(!$scope.content[model])
				$scope.content[model]={}
			if(filters&&filters.length>0)
			{
				const flr={}
				filters.forEach(filter=>
				{
					data.doc.forEach(e=>
					{
						if(!flr[filter])
							flr[filter]={}
						if(e[filter])
							flr[filter][e[filter]._id]=e[filter]
					})
				})
				$scope.content[model].filter=flr
			}
			$scope.content[model].list=data.doc
		}
		catch(error)
		{
			console.log(error)
			return false
		}
	}
	handle.show=(model,data)=>
	{
		try
		{
			if(!data.status)
				return handle.error(model,'show',data)
			if(!data.doc)
				return handle.error(model,'show',data)
			if(!content[model])
				content[model]={}
			content[model].show=data.doc
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
		.get(url,{params:data})
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
	$scope.author=author
}])
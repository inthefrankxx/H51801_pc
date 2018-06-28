require(["config"],function(){
	require(["loadHF", "jquery","template","cookie"], function(promise,$,template){
			// 使用 jquery.cookie.js 插件
	$.cookie.json = true;
	// 读取所有cookie中保存的购物车数据
	 let _products = $.cookie("products") || [];
	 if (_products.length === 0) { // 没有购物车数据
		$(".cart").hide();
	}
	 setTimeout(function(){
		let num =$("#ShopCartNum");
		num.text(parseInt(_products.length));
	},1000);
	// 显示读取到的 cookie 购物车数据
	let html = template("prod_list_temp", {products: _products});
	$(".prod_list").html(html);
	/*********************************************/
	/* 删除 */
	/*********************************************/
	$(".cart_body").on("click", "a.del", function(){
		// 当前待删除商品的编号，在数组中的索引
		let _id = $(this).data("id"),
			_index = exist(_id, _products);
		// 从数组中删除 _index 索引处的元素
		_products.splice(_index, 1);
		// 从cookie中移除部分数据：覆盖保存 _products 数组中的值
		$.cookie("products", _products, {expires:7, path:"/"});
		// 从dom树中删除节点
		$(this).parents("tr").remove();

		if (_products.length === 0) { // 没有购物车数据
			$(".cart_empty").show()
							.next(".prod_list").hide();
		}

		// 计算合计
		calcTotal();
	});

	/*********************************************/
	/* 数量加/减、输入修改 */
	/*********************************************/
	$(".cart_body").on("click", ".add,.minus", function(){
		// 获取修改数量的商品id
		let _id = $(this).data("id");
		// 获取数组中的元素下标
		let _index = exist(_id, _products);
		// 数量加/减
		if ($(this).is(".add"))
			_products[_index].amount++;
		else{
			if (_products[_index].amount <= 1)
				return;
			_products[_index].amount--;
		}

		// 覆盖保存cookie
		$.cookie("products", _products, {expires:7, path:"/"});
		// 显示修改结果
		$(this).siblings(".amount").val(_products[_index].amount);
		// 显示小计
		let _sub = _products[_index].price * _products[_index].amount;
		$(this).parent().next().text(_sub);

		// 计算合计
		calcTotal();
	});

	$(".cart_body").on("blur", ".amount", function(){
		// 获取修改数量的商品id
		let _id = $(this).data("id");
		// 获取数组中的元素下标
		let _index = exist(_id, _products);
		// 判断输入数据的地格式
		if (!/^[1-9]\d*$/.test($(this).val())){
			$(this).val(_products[_index].amount);
			return;
		}

		// 修改数组中对应元素的数量
		_products[_index].amount = $(this).val();

		// 覆盖保存cookie
		$.cookie("products", _products, {expires:7, path:"/"});
		// 显示小计
		let _sub = _products[_index].price * _products[_index].amount;
		$(this).parent().next().text(_sub);

		// 计算合计
		calcTotal();
	});

	/*********************************************/
	/* 全选 */
	/*********************************************/
	$("#ck_all").on("click", function(){
		// 获取当前全选框的选中状态
		let _status = $(this).prop("checked");
		// 设置所有商品行前复选框选中状态
		$(".ck_prod").prop("checked", _status);
		// 计算合计
		calcTotal();
	});
	$(".ck_prod").on("click", function(){
		let _status = $(".ck_prod:checked").length === _products.length;
		$("#ck_all").prop("checked", _status);
		// 计算合计
		calcTotal();
	});

	// 找出 id 对应商品在 prodcuts 中下标
	function exist(id, products) {
		var existIndex = -1;
		$.each(products, function(index, prod){
			if(prod.pid == id) {
				existIndex = index;
				return false;
			}
		});
		return existIndex;
	}

		// 计算合计
		function calcTotal() {
			let sum = 0;
			$(".ck_prod:checked").each(function(index, element){
				sum += Number($(this).parents("tr").find(".sub").text());
			});
			$(".total").text("$" + sum);
		}
	//加载省份
	function loadProvince() {
		const url1 = "http://route.showapi.com/1149-1?showapi_appid=29550&showapi_sign=1b9802a551774e3480cb844e18f0ceef&level=1&page=1",
			url2 = "http://route.showapi.com/1149-1?showapi_appid=29550&showapi_sign=1b9802a551774e3480cb844e18f0ceef&level=1&page=2";
		// 读取两页省份数据
		$.when($.ajax(url1,{dataType:"json"}), $.ajax(url2, {dataType:"json"}))
		  .then(function(data1, data2){
		  	// html 字符串
		  	let html = "<option value='-1'>请选择省份</option>";
		  	// 将省份数组遍历，每个省份信息添加到下拉列表项中
			data1[0].showapi_res_body.data
				.concat(data2[0].showapi_res_body.data)
				.forEach(function(curr){
					html += `<option value="${curr.id}">${curr.areaName}</option>`;
				});	
			// 显示省份信息
			$("#province").html(html);
		});
	}

	// 加载城市
	function loadCity() {
		// 获取所选中的省份id
		const prov_id = $("#province").val();
		// 根据省份id查询城市信息
		const url = `http://route.showapi.com/1149-2?showapi_appid=29550&showapi_sign=1b9802a551774e3480cb844e18f0ceef&parentId=${prov_id}`;
		$.getJSON(url, function(data){
			let html = "<option value='-1'>请选择城市</option>";
			data.showapi_res_body.data.forEach(function(curr){
				html += `<option value="${curr.id}">${curr.areaName}</option>`;
			});
			$("#city").html(html);
		});
	}

	// 加载区县
	function loadDistrict() {
		// 获取所选中的城市id
		const city_id = $("#city").val();
		// 根据城市id查询区县信息
		const url = `http://route.showapi.com/1149-2?showapi_appid=29550&showapi_sign=1b9802a551774e3480cb844e18f0ceef&parentId=${city_id}`;
		$.getJSON(url, function(data){
			let html = "<option value='-1'>请选择区县</option>";
			data.showapi_res_body.data.forEach(function(curr){
				html += `<option value="${curr.id}">${curr.areaName}</option>`;
			});
			$("#district").html(html);
		});
	}

	loadProvince();
	// 省份选择发生改变，则加载城市
	$("#province").on("change", loadCity);
	// 城市选择发生改变，加载区县
	$("#city").on("change", loadDistrict);
	});
});
require(["config"],function(){
	require(["loadHF", "jquery","template","cookie"], function(promise,$,template){
	// 使用 jquery.cookie.js 插件
	$.cookie.json = true;
	// 读取所有cookie中保存的购物车数据
	let _products = $.cookie("products") || [];
	console.log(_products.length);
	setTimeout(function(){
		let num =$("#ShopCartNum");
		num.text(parseInt(_products.length));
	},1000);
	if (_products.length === 0) { // 没有购物车数据
		$(".cart_empty").show()
						.next(".prod_list").hide();
		$(".jiesuan").hide();
		return;
	}
	// 显示读取到的 cookie 购物车数据
	let html = template("prod_list_temp", {products: _products});
	$(".cart_empty").hide()
					.next(".prod_list").show()
					.html(html);

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
			$(".total").text("$" + sum.toFixed(2));
		}
	});
});
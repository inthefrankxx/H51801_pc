<?php 
	header("Access-Control-Allow-Origin:*");
	// 获取登录用户名与密码
	$username = $_POST["username"];
	$password = $_POST["password"];

	echo '<meta charset="utf-8">';

	/* 连接数据库，验证用户是否登录成功 */
	// 创建连接
	mysql_connect("localhost:3306", "root", "");
	// 选择数据库
	mysql_select_db("queen");
	// 编码
	mysql_query("set character set 'utf8'");
	mysql_query("set names 'utf8'");
	// 创建查询SQL语句
	$sql = "SELECT uid, username FROM usering WHERE username='$username' AND password='$password'";
	// 执行SQL命令
	$result = mysql_query($sql);
	// 处理查询结果集
	if($row = mysql_fetch_array($result, MYSQL_ASSOC))
		echo json_encode($row);
	else
		echo "没注册";

	// 关闭连接
	mysql_close();
 ?>
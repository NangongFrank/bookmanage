<?php

/**
 * @Author: frankzhao
 * @Date:   2018-11-23 08:54:17
 * @Last Modified by:   frank_zhao
 * @Last Modified time: 2019-04-14 13:39:34
 */
include 'hostAndDbName.php';

// 书籍展示，书籍查询
if (isset($_GET['book'])) {
	$book = $_GET['book'];
	$page = $_GET['page'];
	$start = ($page - 1) * 12;
	$end = $page * 12 + 1;
	$link = mysqli_connect("$host", "root", "", $dbName);
	if ($link) {
		mysqli_set_charset($link, "utf8");
		mysqli_autocommit($link, false);
		switch ($book) {
			case "default":
			$sql = "select a.id, a.bookName, a.inventory, b.authorName, c.bookTip, c.cover  from (select * from `books` limit $start,$end)a, (select * from `author`)b, (select * from `book`)c where a.bookId = c.id and b.id = c.authorId";
			$sql1 = "select count(*) from books";
			break;
			#取出没有库存的
			case "list" :
				$sql = "select a.id, a.bookName, a.inventory, a.borrowed, b.authorName, a.createTime  from (select * from `books` limit $start,$end)a, (select * from `author`)b, (select * from `book`)c where a.bookId = c.id and b.id = c.authorId and a.inventory > 0";
				$sql1 = "select count(*)  from (select * from `books`)a, (select * from `author`)b, (select * from `book`)c where a.bookId = c.id and b.id = c.authorId and a.inventory > 0";
			break;
			# 对应搜索某一个书籍的信息 ~ 通过图书名称或者作者名称
			default:
				$sql = "select a.id, a.bookName, a.inventory, b.authorName, c.bookTip, c.cover  from (select * from `books`)a, (select * from `author`)b, (select * from `book`)c where a.bookId = c.id and b.id = c.authorId and (b.authorName like '%$book%' or a.bookName like '%$book%') limit $start,$end";
				$sql1 = "select count(*)  from (select * from `books`)a, (select * from `author`)b, (select * from `book`)c where a.bookId = c.id and b.id = c.authorId and (b.authorName like '%$book%' or a.bookName like '%$book%')";
				// "select * from `author` where `authorName` like '$book'"
				break;
		}
		$result = mysqli_query($link, $sql);
		$result1 = mysqli_query($link, $sql1);
		if (mysqli_num_rows($result) > 0) {
			mysqli_commit($link);
			$response = [];
			while ($row = mysqli_fetch_assoc($result)) {
				array_push($response, $row);
			}
			mysqli_free_result($result);
			$result = mysqli_fetch_array($result1, MYSQLI_NUM);
			$sum = $result[0];
			$response = ['data' => $response, 'count' => $sum];
		} else {
			$response = ['data' => '未查找到对应数据', 'count' => 0];
			mysqli_rollback($link);
		}
		#print_r($response);

		$response = json_encode($response);
		# 返回查询结果
		// 添加相应的查询结果信息
		// 数据封装
		echo $response;
		# 关闭数据库
		mysqli_close($link);
	}

}
// 借书记录 ~ 单人，全部
if (isset($_GET['userName'])) {
	# 判断用户名
	$userName = $_GET["userName"];
	$page = $_GET['page'];
	$start = ($page - 1) * 12;
	$end = $page * 12;
	$link = mysqli_connect("$host", "root", "", $dbName);
	if ($link) {
		mysqli_set_charset($link, "utf8");
		mysqli_autocommit($link, false);
		switch ($userName) {
			case "*":
				$sql = "select a.id, a.bookName, c.authorName, a.inventory, a.borrowed, a.createTime from (select * from `books`)a, (select * from `book`)b, (select * from `author`)c where a.bookId = b.id and b.authorId = c.id and a.inventory > 0 limit $start,$end";
				$sql1 = "select count(*) from (select * from `books`)a, (select * from `book`)b, (select * from `author`)c where a.bookId = b.id and b.authorId = c.id and a.inventory > 0";
				break;

			default:
				$sql = "select a.id, c.userAllName, a.bookName, a.borrowedUserName, a.borrowedDate, a.returnDate, b.inventory, b.borrowed from (select * from `borrowedInfo`)a, (select * from `books`)b, (select * from `userInfo`)c where c.userName = a.borrowedUserName and a.booksId = b.id  and a.borrowedUserName = '$userName' limit $start,$end";
				$sql1 = "select count(*) from (select * from `borrowedInfo`)a, (select * from `books`)b, (select * from `userInfo`)c where c.userName = a.borrowedUserName and a.booksId = b.id and a.borrowedUserName = '$userName'";
				break;
		}
		$result = mysqli_query($link, $sql);
		$result1 = mysqli_query($link, $sql1);
		if (mysqli_num_rows($result) > 0) {
			mysqli_commit($link);
			$result1 = mysqli_fetch_array($result1, MYSQLI_NUM);
			$num = $result1[0];
			$response = array();
			while ($row = mysqli_fetch_assoc($result)) {
				array_push($response, $row);
			}
			$response = ['data' => $response, 'count' => $num];
		} else {
			$response = ['data' => '请求操作失败!', 'count' => 0];
		}
		$response = json_encode($response);
		echo $response;
		mysqli_close($link);
	}


}
// 还书操作
// 更新用户借阅记录信息和图书库存信息
if (isset($_POST['borrowedInfos'])) {
	$info = $_POST['borrowedInfos'];
	$id = $info['id'];
	$inventory = $info['inventory'];
	$borrowed = $info['borrowed'];
	$type = 'none';
	if(!empty($_POST['type'])){
		$type = $_POST['type'];
	}
	$link = mysqli_connect($host, "root", "", $dbName);
	if ($link) {
		mysqli_set_charset($link, 'utf8');
		mysqli_autocommit($link, false);
		$date = date("Y-m-d");
		# 更新还书时间 修改库存信息
		if($type == 'none') {
			$sql1 = "update `borrowedInfo` set `returnDate` = '$date' where `id` = $id";
			$inventory ++;
			$borrowed --;
			$sql2 = "update `books` set `inventory` = $inventory, `borrowed` = $borrowed where `id` = (select `booksId` from `borrowedInfo` where `id` = $id)";	
			
		} else if($type == "confirm") {
			$sql1 = "update `borrowedInfo` set `returnDate` = '1970-01-01' where `id` = $id";
		} else if($type == 'cancel') {
			$sql1 = "update `borrowedInfo` set `returnDate` = '0' where `id` = $id";
		}
		mysqli_query($link, $sql1);
		$token1 = mysqli_affected_rows($link);
		$token = 1;
		if(!empty($sql2)) {
			mysqli_query($link, $sql2);
			$token2 = mysqli_affected_rows($link);
			$token = $token1 + $token2;
			if($token == 2) {
				$token = true;
			}
		}
		if ($token) {
			mysqli_commit($link);
			if($type == 'none') {
				$response = ['msg' => '还书操作成功！', 'state' => 1];
			} else if($type == "confirm") {
				$response = ['msg' => '申请成功！', 'state' => 1];
			} else if($type == "cancel") {
				$response = ['msg' => '取消申请成功！', 'state' => 1];
			}
		} else if ($token1 == 1){
			mysqli_rollback($link);
			$response = ['msg' => '操作失败，书籍信息有误！', 'state' => 0];
		} else if ($token2 == 1) {
			mysqli_rollback($link);
			$response = ['msg' => '操作失败，借书信息信息有误！', 'state' => 0];
		} else {
			mysqli_rollback($link);
			$response = ['msg' => '操作失败，请求参数有误！', 'state' => 0];
		}
		$response = json_encode($response);
		echo $response;
		mysqli_close($link);
	}

}
// 借书操作
// 1. 使用书籍展示接口，展示已有书籍信息
// 2. 给出限定，库存>0书籍，可以借阅
// 3. 借书操作过程，查看需要借阅的书籍中的借书人，并将当前的借书人，追加至其中
   ## 添加一条新的用户借书记录，更新书籍关联信息
   # 是否添加一条控制，已借书籍不能再借
if (isset($_POST['list'])) {
	$list = $_POST['list'];
	$link = mysqli_connect($host, "root", "", $dbName);
	if ($link){
		mysqli_set_charset($link, "utf8");
		$id = $list['id'];
		$userName = $list['userName'];
		$bookName = $list['bookName'];
		$inventory = $list['inventory'];
		$borrowed = $list['borrowed'];
		$nowDate = date('Y-m-d');
		# 开启事务
		mysqli_autocommit($link, false);
		# 新增一条借书记录
		$sql1 = "INSERT INTO `borrowedInfo`(`id`, `borrowedUserName`, `bookName`, `borrowedDate`, `returnDate`, `booksId`) VALUES ('null','$userName','$bookName','$nowDate','0', (select `id` from `book` where `bookName` = '$bookName'))";
		mysqli_query($link, $sql1);
		$insertInfo = mysqli_affected_rows($link);
		# 修改单本书籍信息
		$inventory --;
		$borrowed ++;
		$sql2 = "UPDATE `books` SET `inventory`='$inventory',`borrowed`='$borrowed' WHERE `id` = '$id'";
		mysqli_query($link, $sql2);
		$borrowedInfo = mysqli_affected_rows($link);
		$rowsInfo = $insertInfo + $borrowedInfo;
		# 实现重复借未归还书籍的验证
		$sql3 = "select * from `borrowedInfo` where `borrowedUserName` = '$userName' and `bookName` = '$bookName' and `returnDate` = 0";
		$result = mysqli_query($link, $sql3);
		$rows = mysqli_num_rows($result);
		if ($rowsInfo > 1) {
			if ($rows < 2) {
				mysqli_commit($link);
				$response = ['msg' => '借书成功，欢迎借阅！', 'state' => 1];
			} else {
				mysqli_rollback($link);
				$response = ['msg' => '不可重复借阅同一本书，请先还书！', 'state' => 0];
			}
		} else {
			# 事务回滚操作 ～ 两次数据库操作中，出现问题的进行反向操作
			mysqli_rollback($link);
			$response = ['msg' => '借书失败，请重试！', 'state' => 0];
		}
		$response = json_encode($response);
		echo $response;
		mysqli_close($link);
	}
}
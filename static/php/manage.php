<?php

/**
 * @Author: frankzhao
 * @Date:   2018-12-03 20:20:39
 * @Last Modified by:   name
 * @Last Modified time: 2019-04-02 12:29:59
 */
include "hostAndDbName.php";

if (isset($_GET['user'])) {
	$user = $_GET["user"];
	$link = mysqli_connect($host, "root", "", $dbName);
	if ($link) {
		mysqli_set_charset($link, "utf8");
		mysqli_autocommit($link, false);
		if ($user == 1) {
			$sql1 = "select * from `userInfo`";
		} else {
			$sql1 = "select * from `userInfo` where `userName` like '%$user%' or `userAllName` like '%$user%'";
		}
		$result = mysqli_query($link, $sql1);
		$userInfoRows = mysqli_num_rows($result);
		$userInfo = array();
		while ($out = mysqli_fetch_assoc($result)) {
			array_push($userInfo, $out);
		}
		mysqli_free_result($result);
		$sql2 = "select * from `userType` where `id` = 1";
		$result = mysqli_query($link, $sql2);
		$userTypeRows = mysqli_num_rows($result);
		$userType = array();
		while ($out = mysqli_fetch_assoc($result)) {
			array_push($userType, $out);
		}
		mysqli_free_result($result);
		if ($userInfoRows && $userTypeRows) {
			mysqli_commit($link);
			$response = array();
			foreach ($userInfo as $key => $value) {
				foreach ($userType as $key1 => $value1) {
					if ($value['userTypeId'] == $value1["id"]){
						$arr = array_merge($value1, $value);
						array_push($response, $arr);
					}
				}
			}
			$response = ['data' => $response, 'state' => 1, 'msg' => "操作成功！"];
		} else {
			$response = ['data' => null, 'state' => 0, 'msg' => '数据请求失败！'];
			mysqli_rollback($link);
		}
		$response = json_encode($response);
		echo $response;
		mysqli_close($link);
	}
}
if (isset($_POST['user'])) {
	# id 对应操作的对象
	# type 对应是哪种操作
	## 分为 update , delete 和 insert
	# user 传递新数据 ~ 对象
	$user = $_POST['user'];
	if (isset($_POST['id'])) {
		$id = $_POST['id'];
	}
	if (isset($_POST['type'])) {
		$type = $_POST['type'];
	}
	$link = mysqli_connect($host, "root", "", $dbName);
	if ($link && isset($id) && isset($type)) {
		mysqli_set_charset($link, "utf8");
		mysqli_autocommit($link, false);
		switch ($type) {
			case "insert":
				$userName = $user['userName'];
				$password = $user['password'];
				$userAllName = $user["userAllName"];
				$sql = "insert into `userInfo`(`userName`, `password`, `userAllName`, `userTypeId`) values ('$userName', '$password', '$userAllName', 1)";
				mysqli_query($link, $sql);
				if (mysqli_affected_rows($link) > 0) {
					mysqli_commit($link);
					$response = ["data" => null, 'msg' => "添加用户成功!", 'state' => 1];
				} else {
					$response = ["data" => null, 'msg' => "添加用户失败!", 'state' => 2];
					mysqli_rollback($link);
				}
				break;

			case "update":
				$userName = $user['userName'];
				$password = $user['password'];
				$userAllName = $user["userAllName"];
				# 能够修改信息的用户类型为1
				$sql = "update `userInfo` set `userName` = '$userName', `password` = '$password', `userAllName` = '$userAllName' where `id` = '$id'";
				mysqli_query($link, $sql);
				$rows = mysqli_affected_rows($link);
				if ($rows > 0) {
					mysqli_commit($link);
					$response = ["data" => null, 'msg' => "数据更新成功！", 'state' => 1];
				} else {
					$response = ["data" => null, 'msg' => "没有数据修改，更新失败", 'state' => 2];
					mysqli_rollback($link);
				}
				break;
			case "delete" :
				$sql = "delete from `userInfo` where `id` = '$id'";
				mysqli_query($link, $sql);
				$result = mysqli_affected_rows($link);
				if ($result > 0) {
					mysqli_commit($link);
					$response = ["data" => null, 'msg' => "删除操作成功！", 'state' => 1];
				} else {
					$response = ["data" => null, 'msg' => "删除操作失败！", 'state' => 2];
					mysqli_rollback($link);
				}
				break;
			default :
				$response = ["data" => null, 'msg' => "请求的参数数据异常", 'state' => 2];
		}
		mysqli_close($link);
	} else {
		$response = ["msg" => '提交数据不完整', 'state' => 2, 'data' => null];
		mysqli_close($link);
	}
	$response = json_encode($response);
	echo $response;
}

if (isset($_GET['borrowedInfo'])) {
	$borrowedInfo = $_GET['borrowedInfo'];
	$page = $_GET['page'];
	$start = ($page - 1) * 12;
	$end = $page * 12 + 1;
	$link = mysqli_connect($host, "root", "", $dbName);
	if ($link) {
		mysqli_set_charset($link, "utf8");;
		switch ($borrowedInfo) {
			case "*":
				$sql = "select a.id, a.borrowedDate, a.returnDate, a.bookName, b.userName, b.userAllName from (select * from `borrowedInfo`)a, (select * from `userInfo`)b where a.borrowedUserName = b.userName limit $start,$end";
				$sql1 = "select count(*) from (select * from `borrowedInfo`)a, (select * from `userInfo`)b where a.borrowedUserName = b.userName";
				break;

			default:
				$sql = "select a.id, a.borrowedDate, a.returnDate, a.bookName, b.userName, b.userAllName from (select * from `borrowedInfo`)a, (select * from `userInfo`)b where a.borrowedUserName = b.userName and (b.userName like '%$borrowedInfo%' || b.userAllName like '%$borrowedInfo%') limit $start,$end";
				$sql1 = "select count(*) from (select * from `borrowedInfo`)a, (select * from `userInfo`)b where a.borrowedUserName = b.userName and (b.userName like '%$borrowedInfo%' || b.userAllName like '%$borrowedInfo%')";
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
if (isset($_POST['borrowedInfo'])) {
	if (isset($_POST['id'])) {
		$id = $_POST['id'];
	}
	if (isset($_POST['type'])) {
		$type = $_POST['type'];
	}
	$link = mysqli_connect($host, "root", "", $dbName);
	if ($link) {
		mysqli_set_charset($link, "utf8");
		mysqli_autocommit($link, false);
		switch ($type) {
			case 'update':
				$date = date("Y-m-d");
				$sql = "update `borrowedInfo` set `returnDate` = '$date' where `id` = '$id'";
				mysqli_query($link, $sql);
				if (mysqli_affected_rows($link) > 0) {
					mysqli_commit($link);
					$response = ['data' => null, 'msg' => '还书成功!', 'state' => 1];
				} else {
					$response = ['data' => null, 'msg' => '还书操作失败!请重试..', 'state' => 2];
				}
			break;
			case 'delete' :
				$sql = "delete from `borrowedInfo` where `id` = '$id'";
				mysqli_query($link, $sql);
				if (mysqli_affected_rows($link) > 0) {
					mysqli_commit($link);
					$response = ['data' => null, 'msg' => '记录已删除!', 'state' => 1];
				} else {
					$response = ['data' => null, 'msg' => '记录删除错误!请重试..', 'state' => 2];
				}
			break;
			default:
				$response = ['data' => null, 'msg' => '传参错误，请检查', 'state' => 3];
				break;
		}
		$response = json_encode($response);
		echo $response;
		mysqli_close($link);
	}
}

if (isset($_GET['author'])) {
	$author = $_GET['author'];

	$link = mysqli_connect($host, "root", "", $dbName);
	if ($link) {
		mysqli_set_charset($link, "utf8");
		mysqli_autocommit($link, false);
		switch ($author) {
			case "*":
				$sql = "select * from `author`";
				$result = mysqli_query($link, $sql);
				if (mysqli_num_rows($result) > 0) {
					mysqli_commit($link);
					$arr = array();
					while ($row = mysqli_fetch_assoc($result)) {
					    array_push($arr, $row);
					}
					$response = ['data' => $arr, 'msg' => '查询操作成功', 'state' => 1];
					mysqli_free_result($result);
				} else {
					$response = ['data' => null, 'msg' => '数据操作有误', 'state' => 2];
				}
				break;

			default:
				$sql = "select * from `author` where `authorName` like '%$author%'";
				$result = mysqli_query($link, $sql);
				if (mysqli_num_rows($result) > 0) {
					mysqli_commit($link);
					$arr = array();
					while ($row = mysqli_fetch_assoc($result)) {
					    array_push($arr, $row);
					}
					$response = ['data' => $arr, 'msg' => '查询操作成功', 'state' => 1];
					mysqli_free_result($result);
				} else {
					$response = ['data' => null, 'msg' => '数据操作有误', 'state' => 2];
				}
				break;
		}
		$response = json_encode($response);
		echo $response;
		mysqli_close($link);
	}
}
if (isset($_POST["author"])) {
	$author = $_POST['author'];
	if (isset($_POST['id'])) {
		$id = $_POST['id'];
	}
	if (isset($_POST['type'])) {
		$type = $_POST['type'];
	}
	$link = mysqli_connect($host, "root", "", $dbName);
	if ($link && isset($id) && isset($type)) {
		mysqli_set_charset($link, "utf8");
		mysqli_autocommit($link, false);
		switch ($type) {
			case "insert":
				$authorName = $author['authorName'];
				$authorAdage = $author['authorAdage'];
				$sql = "insert into `author`(`authorName`, `authorAdage`) values ('$authorName',  '$authorAdage')";
				mysqli_query($link, $sql);
				if (mysqli_affected_rows($link) > 0) {
					mysqli_commit($link);
					$response = ["data" => null, 'msg' => "添加作者信息成功!", 'state' => 1];
				} else {
					$response = ["data" => null, 'msg' => "添加作者信息失败!", 'state' => 2];
					mysqli_rollback($link);
				}
				break;

			case "update":
				$authorName = $author['authorName'];
				$authorAdage = $author['authorAdage'];
				# 能够修改信息的用户类型为1
				$sql = "update `author` set `authorName` = '$authorName', `authorAdage` = '$authorAdage' where `id` = '$id'";
				mysqli_query($link, $sql);
				$rows = mysqli_affected_rows($link);
				if ($rows > 0) {
					mysqli_commit($link);
					$response = ["data" => null, 'msg' => "数据更新成功！", 'state' => 1];
				} else {
					$response = ["data" => null, 'msg' => "没有数据修改，更新失败", 'state' => 2];
					mysqli_rollback($link);
				}
				break;
			case "delete" :
				$sql = "delete from `author` where `id` = '$id'";
				mysqli_query($link, $sql);
				$result = mysqli_affected_rows($link);
				if ($result > 0) {
					mysqli_commit($link);
					$response = ["data" => null, 'msg' => "删除操作成功！", 'state' => 1];
				} else {
					$response = ["data" => null, 'msg' => "删除操作失败！", 'state' => 2];
					mysqli_rollback($link);
				}
				break;
			default :
				$response = ["data" => null, 'msg' => "请求的参数数据异常", 'state' => 2];
		}
		mysqli_close($link);
	} else {
		$response = ["msg" => '提交数据不完整', 'state' => 2, 'data' => null];
		mysqli_close($link);
	}
	$response = json_encode($response);
	echo $response;
}

if (isset($_GET['book'])) {
	$book = $_GET['book'];
	$page = $_GET['page'];
	$start = ($page - 1) * 12;
	$end = $page * 12 + 1;
	$link = mysqli_connect($host, "root", "", $dbName);
	if ($link) {
		mysqli_set_charset($link, "utf8");
		mysqli_autocommit($link, false);
		switch ($book) {
			case "*":
				$sql = "SELECT a.id, a.bookName, a.createTime, a.inventory, a.borrowed, b.bookTip, c.authorName FROM (SELECT * FROM `books`)a, (SELECT * FROM `book`)b, (SELECT * FROM `author`)c WHERE a.bookId = b.id AND b.authorId = c.id limit $start,$end";
				$sql1 = "SELECT count(*) FROM (SELECT * FROM `books`)a, (SELECT * FROM `book`)b, (SELECT * FROM `author`)c WHERE a.bookId = b.id AND b.authorId = c.id";
				break;

			default:
				$sql = "SELECT a.id, a.bookName, a.createTime, a.inventory, a.borrowed, b.bookTip, c.authorName FROM (SELECT * FROM `books`)a, (SELECT * FROM `book`)b, (SELECT * FROM `author`)c WHERE a.bookId = b.id AND b.authorId = c.id AND (b.bookName LIKE '%$book%' OR c.authorName LIKE '%$book%') limit $start,$end";
				$sql1 = "SELECT count(*) FROM (SELECT * FROM `books`)a, (SELECT * FROM `book`)b, (SELECT * FROM `author`)c WHERE a.bookId = b.id AND b.authorId = c.id AND (b.bookName LIKE '%$book%' OR c.authorName LIKE '%$book%')";
				break;
		}
		$result = mysqli_query($link, $sql);
		$result1 = mysqli_query($link, $sql1);
		if (mysqli_num_rows($result) > 0) {
			mysqli_commit($link);
			$response = array();
			while ($row = mysqli_fetch_assoc($result)) {
				array_push($response, $row);
			}
			$result1 = mysqli_fetch_array($result1, MYSQLI_NUM);
			$sum = $result1[0];
			$response = ['data' => $response, 'msg' => '获取数据成功！', 'state' => 1, 'count' => $sum];
			mysqli_free_result($result);
		} else {
			$response = ['data' => null, 'msg' => '没有对应记录！', 'state' => 2, 'count' => 0];
			mysqli_rollback($link);
		}
		$response = json_encode($response);
		echo $response;
		mysqli_close($link);
	}
}
if (isset($_POST["book"])) {
	$book = $_POST['book'];
	if (isset($_POST['id'])) {
		$id = $_POST['id'];
	}
	if (isset($_POST['type'])) {
		$type = $_POST['type'];
	}
	$link = mysqli_connect($host, "root", "", $dbName);
	if ($link && isset($id) && isset($type)) {
		mysqli_set_charset($link, "utf8");
		mysqli_autocommit($link, false);
		switch ($type) {
			case "insert":
				$bookName = $book['bookName'];
				$inventory = $book['inventory'];
				$borrowed = $book['borrowed'];
				$date = date("Y-m-d");
				# 书籍上架
				# 将库存中的书籍添加至书架上 ～ books表
				$sql = "insert into `books`(`bookName`, `createTime`, `inventory`, `borrowed`, `bookId`) values ('$bookName',  '$date', '$inventory', '$borrowed', (select `id` from `book` where `bookName` = '$bookName'))";
				mysqli_query($link, $sql);
				if (mysqli_affected_rows($link)	> 0) {
					mysqli_commit($link);
					$response = ['data' => null, 'msg' => '书籍上架成功', 'state' => 1];
				} else {
					$response = ['data' => null, 'msg' => "书库中无此书，上架失败", 'state' => 2];
					mysqli_rollback($link);
				}
				break;
			case "update":
				# 只允许修改库存和借出的数据 和 书籍说明
				$bookTip = $book['bookTip'];
				$inventory = $book['inventory'];
				$borrowed = $book['borrowed'];
				$sql1 = "update `books` set `inventory` = '$inventory',`borrowed` = '$borrowed' where `id` = '$id'";
				$sql2 = "update `book` set `bookTip` = '$bookTip' where `id` = (select `bookId` from `books` where `id` = '$id')";
				mysqli_query($link, $sql1);
				$rows = mysqli_affected_rows($link);
				mysqli_query($link, $sql2);
				$rows += mysqli_affected_rows($link);
				if ($rows > 0 && $rows < 3) {
					mysqli_commit($link);
					$response = ["data" => null, 'msg' => "数据更新成功！", 'state' => 1];
				} else {
					$response = ["data" => null, 'msg' => "没有数据修改，更新失败", 'state' => 2];
					mysqli_rollback($link);
				}
				break;
			case "delete" :
				# 只下架 库存记录中的，基本书籍信息不给操作
				$sql = "delete from `books` where `id` = '$id'";
				mysqli_query($link, $sql);
				$rows = mysqli_affected_rows($link);
				if ($rows == 1) {
					mysqli_commit($link);
					$response = ["data" => null, 'msg' => "下架操作成功！", 'state' => 1];
				} else {
					$response = ["data" => null, 'msg' => "下架操作失败！", 'state' => 2];
					mysqli_rollback($link);
				}
				break;
			default :
				$response = ["data" => null, 'msg' => "请求的参数数据异常", 'state' => 2];
		}
		mysqli_close($link);
	} else {
		$response = ["msg" => '提交数据不完整', 'state' => 2, 'data' => null];
		mysqli_close($link);
	}
	$response = json_encode($response);
	echo $response;
}


if (isset($_GET['bookmanage'])) {
	$book = $_GET['bookmanage'];
	$page = $_GET['page'];
	$start = ($page - 1) * 12;
	$end = $page * 12 + 1;
	$link = mysqli_connect($host, "root", "", $dbName);
	if ($link) {
		mysqli_set_charset($link, "utf8");
		mysqli_autocommit($link, false);
		switch ($book) {
			case "*":
				$sql = "SELECT b.id, b.bookName, c.authorName, b.bookTip, b.payDate FROM (SELECT * FROM `book`)b, (SELECT * FROM `author`)c WHERE b.authorId = c.id limit $start,$end";
				$sql1 = "SELECT count(*) FROM (SELECT * FROM `book`)b, (SELECT * FROM `author`)c WHERE b.authorId = c.id";
				break;

			default:
				$sql = "SELECT b.bookName, b.bookTip, c.authorName FROM (SELECT * FROM `book`)b, (SELECT * FROM `author`)c WHERE b.authorId = c.id AND (b.bookName LIKE '%$book%' OR c.authorName LIKE '%$book%') limit $start,$end";
				$sql1 = "SELECT count(*) FROM (SELECT * FROM `book`)b, (SELECT * FROM `author`)c WHERE b.authorId = c.id AND (b.bookName LIKE '%$book%' OR c.authorName LIKE '%$book%')";
				break;
		}
		$result = mysqli_query($link, $sql);
		$result1 = mysqli_query($link, $sql1);
		if (mysqli_num_rows($result) > 0) {
			mysqli_commit($link);
			$response = array();
			while ($row = mysqli_fetch_assoc($result)) {
				array_push($response, $row);
			}
			$result1 = mysqli_fetch_array($result1, MYSQLI_NUM);
			$sum = $result1[0];
			$response = ['data' => $response, 'msg' => '获取数据成功！', 'state' => 1, 'count' => $sum];
			mysqli_free_result($result);
		} else {
			$response = ['data' => null, 'msg' => '没有对应记录！', 'state' => 2, 'count' => 0];
			mysqli_rollback($link);
		}
		$response = json_encode($response);
		echo $response;
		mysqli_close($link);
	}
}
if(isset($_POST["bookmanage"])) {
	$book = $_POST['bookmanage'];
	if (isset($_POST['id'])) {
		$id = $_POST['id'];
	}
	if (isset($_POST['type'])) {
		$type = $_POST['type'];
	}
	$link = mysqli_connect($host, "root", "", $dbName);
	if ($link && isset($id) && isset($type)) {
		mysqli_set_charset($link, "utf8");
		mysqli_autocommit($link, false);
		switch ($type) {
			case "update":
				$bookTip = $book['bookTip'];
				$cover = $book['cover'];
				$sql = "update `book` set `bookTip` = '$bookTip', `cover` = '$cover' where `id` = $id";
				mysqli_query($link, $sql);
				$rows = mysqli_affected_rows($link);
				if ($rows != 0) {
					mysqli_commit($link);
					$response = ["data" => null, 'msg' => "数据更新成功！", 'state' => 1];
				} else {
					$response = ["data" => null, 'msg' => "没有数据修改，更新失败", 'state' => 2];
					mysqli_rollback($link);
				}
				break;
			case "delete" :
				$sql = "delete from `book` where `id` = '$id'";
				mysqli_query($link, $sql);
				$rows = mysqli_affected_rows($link);
				if ($rows == 1) {
					mysqli_commit($link);
					$response = ["data" => null, 'msg' => "出售操作成功！", 'state' => 1];
				} else {
					$response = ["data" => null, 'msg' => "出售操作失败！", 'state' => 2];
					mysqli_rollback($link);
				}
				break;
			case "add" :
				$bookName = $book['bookName'];
				$bookTip = $book['bookTip'];
				$authorName = $book["authorName"];
				$cover = $book['cover'];
				$date = date("Y-m-d");
				$sql = "select `id` from `author` where `authorName` = '$authorName'";
				$result = mysqli_query($link, $sql);
				if (mysqli_num_rows($result) > 0) {
					$end = mysqli_fetch_assoc($result);
					$end = $end['id'];
					mysqli_free_result($result);
					$sql = "insert into `book` (`bookName`, `bookTip`, `file`, `authorId`, `payDate`, cover) values ('$bookName', '$bookTip', 'files/ren.txt', '$end', '$date', '$cover')";
					mysqli_query($link, $sql);
					if (mysqli_affected_rows($link) > 0) {
						mysqli_commit($link);
						$response = ['data' => null, 'msg' => '书籍购进成功', 'state' => 1];
					} else {
						$response = ['data' => null, 'msg' => "书籍信息填写有误，请检查！", 'state' => 2];
						mysqli_rollback($link);
					}
				} else {
					$response = ['data' => null, 'msg' => "书库中没有对应作者信息，需先添加作者", 'state' => 2];
					mysqli_rollback($link);
				}
				break;
			default :
				$response = ["data" => null, 'msg' => "请求的参数数据错误", 'state' => 2];
		}
		mysqli_close($link);
	} else {
		$response = ["msg" => '提交数据不完整', 'state' => 2, 'data' => null];
		mysqli_close($link);
	}
	$response = json_encode($response);
	echo $response;
}
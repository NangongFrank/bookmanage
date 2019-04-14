<?php 


include "hostAndDbName.php";

if (isset($_POST['name']) && isset($_POST['password'])) {
	$name = $_POST['name'];
	$pwd = $_POST['password'];
	$checkNumber = $_POST['checkNum'];
	if (isset($checkNumber)) {
		session_start();
		$checkNum = $_SESSION['checkNum'];
		if ($checkNumber == $checkNum) {
			$link = mysqli_connect("$host", "root", "", $dbName);
			if ($link) {
				mysqli_set_charset($link, "utf8");
				$sql1 = "select * from `userInfo` where `userName` = '$name'";
				$result = mysqli_query($link, $sql1);
				$rows = mysqli_num_rows($result);
				if ($rows > 0) {
					$userInfoRow = mysqli_fetch_assoc($result);
					mysqli_free_result($result);
					$type = $userInfoRow["userTypeId"];
					$sql2 = "select * from `userType` where `id` = '$type'";
					$result = mysqli_query($link, $sql2);
					$userTypeRow = mysqli_fetch_assoc($result);
					mysqli_free_result($result);
					$userType = $userTypeRow['id'];
					$userName = $userInfoRow["userName"];
					$password = $userInfoRow["password"];
					$userAllName = $userInfoRow["userAllName"];
					if ($pwd == $password) {
						$output = ["type" => $userType, "name" => $userName, "allName" => $userAllName, "msg" => "验证成功", 'state' => 1];
					} else {
						$output = ["msg" => "输入密码错误", 'state' => 0];
					}
				} else {
					$output = ["msg" => "用户不存在", 'state' => 0];
				}
				$response = json_encode($output);
				echo "$response";
				mysqli_close($link);
			}
		} else {
			$output = ["msg" => "验证码输入有误", 'state' => 0];
			$response = json_encode($output);
			echo "$response";
		}
		
	} else {
		$output = ["msg" => "未输入验证码", 'state' => 0];
		$response = json_encode($output);
		echo "$response";
	}
	
}
?>
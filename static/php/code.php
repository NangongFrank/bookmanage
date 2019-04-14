<?php

/**
 * @Author: frankzhao
 * @Date:   2018-12-24 14:39:10
 * @Last Modified by:   frank_zhao
 * @Last Modified time: 2019-01-26 17:24:46
 */
// 验证码
session_start();
$img = imagecreatetruecolor(100, 30);

$bgColor = imagecolorallocate($img, 255, 255, 255);

$textColor = imagecolorallocate($img, 0, 0, 255);

imagefill($img, 0, 0, $bgColor);
$captchCode = "";

for ($i = 0; $i < 4; ++$i) {
	$fontSize = 6;
	$x = ($i * 24) + mt_rand(5, 10);
	$y = mt_rand(5, 10);
	$data = 'abcdefghijkmnpqrstuvwxyz23456789';
	$fontContent = substr($data, mt_rand(0, strlen($data)) - 1, 1);
	$fontColor = imagecolorallocate($img, mt_rand(0, 100), mt_rand(0, 100), mt_rand(0, 100));
	imagestring($img, $fontSize, $x, $y, $fontContent, $fontColor);
	$captchCode .= $fontContent;
}

$_SESSION['checkNum'] = $captchCode;

for ($m = 0; $m <= 600; ++ $m) {
	$x2 = mt_rand(1, 99);
	$y2 = mt_rand(1, 99);
	$pointerColor = imagecolorallocate($img, mt_rand(0, 255), mt_rand(0, 255), mt_rand(0, 255));
	imagesetpixel($img, $x2, $y2, $pointerColor);
}

for ($i = 0; $i <= 10; ++$i) {
	$x1 = mt_rand(0, 99);
	$y1 = mt_rand(0, 99);
	$x2 = mt_rand(0, 99);
	$y2 = mt_rand(0, 99);
	$lineColor = imagecolorallocate($img, mt_rand(0, 255), mt_rand(0, 255), mt_rand(0, 255));
	imageline($img, $x1, $y1, $x2, $y2, $lineColor);
}
header('content-type:image/png');
imagepng($img);
imagedestroy($img);
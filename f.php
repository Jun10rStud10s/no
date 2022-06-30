<?php

include("config.php");
$connect = mysqli_connect($dbhost, $dbuser, $dbpass,$dbname) or die("Unable to connect to '$dbhost'");


$cid = "";
if(isset($_GET["id"])){
	$cid = $_GET["id"];
}

$stmt = $connect->prepare("SELECT * FROM contentsfiles WHERE ContentId=?"); 
$stmt->bind_param("s", $cid);
$stmt->execute();
$results = $stmt->get_result();
$fileList = array();


$i = 0;
while ($row = $results->fetch_row()) {
	$fileEnt = array("name" => array(urldecode($row[2])."/".urldecode($row[3])."/".urldecode($row[4])), "size" => array($row[5]));
	array_push($fileList, $fileEnt);
	$i = $i + 1;
}

echo(json_encode($fileList));

?>
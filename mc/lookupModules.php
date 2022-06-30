<?php

include("../config.php");
$connect = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname) or die("Unable to connect to '$dbhost'");

if(isset($_GET["id"])){
	$id = $_GET['id'];
	
	$modules = array();
	
	$stmt = $connect->prepare("SELECT * FROM contentsmodules WHERE ContentId=?"); 
	$stmt->bind_param("s", $id);
	$stmt->execute();
	$results = $stmt->get_result();
	
	while ($row = $results->fetch_row()) {
		
		$module = array('KeyId' => $row[1],
			'UrlId' => $row[2],
			'ZipName' => $row[3],
			'InnerZipName' => $row[4],
			'Module' => $row[5]
		);
		array_push($modules, $module);
	}
	
	echo(json_encode($modules));
}

?>
<?php

include("../config.php");
$connect = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname) or die("Unable to connect to '$dbhost'");

if(isset($_GET["id"])){
	$id = $_GET['id'];
	
	$urls = array();
	
	$stmt = $connect->prepare("SELECT * FROM contentsurls WHERE ContentId=?"); 
	$stmt->bind_param("s", $id);
	$stmt->execute();
	$results = $stmt->get_result();

	
	while ($row = $results->fetch_row()) {
		
		$urlEntry = array('UrlId' => $row[1],
			'UrlType' => $row[2],
			'Url' => $row[3]
		);
		array_push($urls, $urlEntry);
	}
	
	echo(json_encode($urls));
}

?>
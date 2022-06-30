<?php

include("../config.php");
$connect = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname) or die("Unable to connect to '$dbhost'");

if(isset($_GET["id"])){
	$id = $_GET['id'];
	
	$keys = array();
	
	$stmt = $connect->prepare("SELECT * FROM contentskeys WHERE ContentId=?"); 
	$stmt->bind_param("s", $id);
	$stmt->execute();
	$results = $stmt->get_result();

	
	while ($row = $results->fetch_row()) {
		
		$keyEntry = array('KeyId' => $row[1],
			'KeyType' => $row[2],
			'Key' => $row[3]
		);
		array_push($keys, $keyEntry);
	}
	
	echo(json_encode($keys));
}

?>
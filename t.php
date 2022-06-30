<?php

include("config.php");
$connect = mysqli_connect($dbhost, $dbuser, $dbpass,$dbname) or die("Unable to connect to '$dbhost'");

function getContentType($typetext) {
	if($typetext == "SKINPACK")
		return 1;
	if($typetext == "WORLD")
		return 2;
	if($typetext == "RESOURCEPACK")
		return 3;
	if($typetext == "PERSONA")
		return 4;
	if($typetext == "MIXED")
		return 5;
	
	return 6;
	
}

if(isset($_GET["id"])){
	$id = $_GET['id'];
	
	$stmt = $connect->prepare("SELECT * FROM contents WHERE Id=?"); 
	$stmt->bind_param("s", $id);
	$stmt->execute();
	$results = $stmt->get_result();
	$row = $results->fetch_row();

	$desc_res = array('id' => $row[0],
		'category' => getContentType($row[3]),
		'status' => '',
		'name' => urldecode($row[1]),
		'num_files' => 0,
		'size' => $row[5],
		'seeders' => 0,
		'leechers' => 0,
		'username' => "Anonymous",
		'added' => $row[4],
		'descr' =>  urldecode($row[2]),
		'imdb' => null,
		'language' => 'en-US',
		'textlanguage' => 'en-US',
		'info_hash' => $row[0]
	);

	echo(json_encode($desc_res));
}

?>

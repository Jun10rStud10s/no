<?php


include("config.php");
$connect = mysqli_connect($dbhost, $dbuser, $dbpass,$dbname) or die("Unable to connect to '$dbhost'");

function getCategoryType($category) {
	
	if($category >= 100)
		$category = $category / 100;
	
	if($category == 1)
		return "SKINPACK";
	if($category == 2)
		return "WORLD";
	if($category == 3)
		return "RESOURCEPACK";
	if($category == 4)
		return "PERSONA";
	if($category == 5)
		return "MIXED";
	
	return "UNKNOWN";
}

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

if(isset($_GET["q"])){
	$q = $_GET["q"];
	$skip = 0;
	
	$kat = null;
		
	if(isset($_GET["cat"])){
		if($_GET["cat"] !== "0") {
			if($_GET["cat"] != "") {
				$kat = explode(",",$_GET["cat"]);
			}
		}
	}
	
	$totalSearch = 50;
	
	$words = explode(" ", $q);
	$newWords = array();
	foreach($words as $word){
		if(strpos($word, ":") !== false) {
			$filter = explode(":", $word);
			if(strtolower($filter[0]) == "category") {
				$spush = getCategoryType(intval($filter[1]));
				if(!is_array($kat)){
					$kat = array();
					$kat[0] = $spush;
				}
				else{
					array_push($kat, $spush);
				}
				continue;
			}
			else if(strtolower($filter[0]) == "top100") {
				if(strtolower($filter[1]) == "recent") {
					$totalSearch = 100;
				}
			}
			else{
				array_push($newWords, $word);
			}
		}
		else{
			array_push($newWords, $word);
		}
	}
	$q = trim(implode(" ", $newWords));
	
	
	if(isset($_GET["page"])){
		$skip = intval($_GET["page"]);
	}
	
	$skip = $skip * 50;
	$data = "%".$q."%";

	$stmt = null;
	
	mysqli_set_charset($connect, "latin1_swedish_ci");
	$extraWhereConditions = "";
	if($kat !== null) {
		for($i = 0; $i < count($kat); $i++){
			if($i == 0)
				$extraWhereConditions .= " AND (";
			$extraWhereConditions .= "Type=\"".mysqli_real_escape_string($connect, $kat[$i])."\"";
			
			if(($i+1) != count($kat)){
				$extraWhereConditions .= " OR ";
			}
			else{
				$extraWhereConditions .= ")";
			}
				
		}
	}
	
	if($q != "") {
		$stmt = $connect->prepare("SELECT * FROM contents WHERE Title LIKE ? AND (SELECT COUNT(*) FROM contentskeys WHERE ContentId=contents.Id AND NOT KeyData = \"UNKNOWN\")>=1 ".$extraWhereConditions." ORDER BY DateAdded DESC LIMIT ? OFFSET ?"); 
		$stmt->bind_param("sii", $data, $totalSearch, $skip);
		$stmt->execute();		
	}
	else {
		$stmt = $connect->prepare("SELECT * FROM contents WHERE (SELECT COUNT(*) FROM contentskeys WHERE ContentId=contents.Id AND NOT KeyData = \"UNKNOWN\")>=1 ".$extraWhereConditions." ORDER BY DateAdded DESC LIMIT ? OFFSET ?"); 
		$stmt->bind_param("ii", $totalSearch, $skip);
		$stmt->execute();
	}
	
	$results = $stmt->get_result();
	
	$search_results = array();
	
	while ($row = $results->fetch_row()) {
		$data = array('id' => $row[0], 
		'name' => urldecode($row[1]), 
		"info_hash" => $row[0],
		"leechers" => 0,
		"seeders" => 0,
		"num_files" => 0,
		"size" => $row[5],
		"username" => "Anonymous",
		"added" => $row[4],
		"status" => "",
		"category" => getContentType($row[3]));
		
		array_push($search_results, $data);
	}
	
	echo(json_encode($search_results));
	
}



?>
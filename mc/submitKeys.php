<?php

include("../config.php");
ignore_user_abort(true);
ini_set('max_execution_time', '0');
set_time_limit(0);

$connect = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname) or die("Unable to connect to '$dbhost'");

$keys = file_get_contents('php://input');
$keysJson = json_decode($keys);

file_put_contents('keys_backup/'.md5($keys).'_'.(string)time().'_keys.json', $keys);

$connect->begin_transaction();

foreach($keysJson as &$keysEntry) {
	$keyId = $keysEntry->id;
	$contentKey = $keysEntry->contentKey;
	if($contentKey == "s5s5ejuDru4uchuF2drUFuthaspAbepE") {
		continue;
	}
	$stmt = $connect->prepare("UPDATE contentskeys SET KeyData=? WHERE KeyId=? AND KeyData='UNKNOWN'"); 
	$stmt->bind_param("ss", $contentKey, $keyId);
	$stmt->execute();
}


$connect->commit();

$response = array('Status' => '200 OK');

echo(json_encode($response));

?>

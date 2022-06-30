<?php
include("config.php");

$fmt = "sql";

if(isset($_GET["fmt"])){
	$fmt = strtolower($_GET["fmt"]);
}

if($fmt == "sql") {
	$filename = "backup-" . date("d-m-Y") . ".sql.gz";
	$mime = "application/x-gzip";

	header( "Content-Type: " . $mime );
	header( 'Content-Disposition: attachment; filename="' . $filename . '"' );

	$cmd = "mysqldump --single-transaction --quick --lock-tables=false -u $dbuser --password=$dbpass $dbname | gzip --best";   

	passthru( $cmd );

	exit(0);
}

if($fmt == "kdb"){
	$connect = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname) or die("Unable to connect to '$dbhost'");

	$filename = "keys.db";
	$mime = "text/plain";

	header( "Content-Type: " . $mime );
	header( 'Content-Disposition: attachment; filename="' . $filename . '"' );
	$results = mysqli_query($connect, "SELECT KeyId,KeyData FROM contentskeys WHERE NOT KeyData=\"UNKNOWN\""); 
	
	while ($row = $results->fetch_row()) {	
		echo($row[0].'='.$row[1]."\n");
	}
}



if($fmt == "kcsv"){
	$connect = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname) or die("Unable to connect to '$dbhost'");

	$filename = "keys.csv";
	$mime = "text/plain";

	header( "Content-Type: " . $mime );
	header( 'Content-Disposition: attachment; filename="' . $filename . '"' );
	$results = mysqli_query($connect, "SELECT * FROM contentskeys"); 
	
	echo("ContentId,KeyId,KeyType,KeyData\n");
	while ($row = $results->fetch_row()) {	
		echo(implode(",", $row)."\n");
	}
}

if($fmt == "ktsv"){
	$connect = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname) or die("Unable to connect to '$dbhost'");

	$filename = "keys.tsv";
	$mime = "text/plain";

	header( "Content-Type: " . $mime );
	header( 'Content-Disposition: attachment; filename="' . $filename . '"' );
	$results = mysqli_query($connect, "SELECT * FROM contentskeys"); 
	
	echo("ContentId\tKeyId\tKeyType\tKeyData\n");
	while ($row = $results->fetch_row()) {	
		echo(implode("\t", $row)."\n");
	}
}


if($fmt == "fcsv"){
	$connect = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname) or die("Unable to connect to '$dbhost'");

	$filename = "files.csv";
	$mime = "text/plain";

	header( "Content-Type: " . $mime );
	header( 'Content-Disposition: attachment; filename="' . $filename . '"' );
	$results = mysqli_query($connect, "SELECT * FROM contentsfiles"); 
	
	echo("ContentId,KeyId,ZipName,InnerZipName,FileName,FileSize\n");
	while ($row = $results->fetch_row()) {	
		echo(implode(",", $row)."\n");
	}
}

if($fmt == "ftsv"){
	$connect = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname) or die("Unable to connect to '$dbhost'");

	$filename = "files.tsv";
	$mime = "text/plain";

	header( "Content-Type: " . $mime );
	header( 'Content-Disposition: attachment; filename="' . $filename . '"' );
	$results = mysqli_query($connect, "SELECT * FROM contentsmodules"); 
	
	echo("ContentId\tKeyId\tZipName\tInnerZipName\tFileName\tFileSize\n");
	while ($row = $results->fetch_row()) {	
		echo(implode("\t", $row)."\n");
	}
}

if($fmt == "tcsv"){
	$connect = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname) or die("Unable to connect to '$dbhost'");

	$filename = "tags.csv";
	$mime = "text/plain";

	header( "Content-Type: " . $mime );
	header( 'Content-Disposition: attachment; filename="' . $filename . '"' );
	$results = mysqli_query($connect, "SELECT * FROM contentstags"); 
	
	echo("Id,Tag\n");
	while ($row = $results->fetch_row()) {	
		echo(implode(",", $row)."\n");
	}
}

if($fmt == "ttsv"){
	$connect = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname) or die("Unable to connect to '$dbhost'");

	$filename = "tags.tsv";
	$mime = "text/plain";

	header( "Content-Type: " . $mime );
	header( 'Content-Disposition: attachment; filename="' . $filename . '"' );
	$results = mysqli_query($connect, "SELECT * FROM contentstags"); 
	
	echo("Id\tTag\n");
	while ($row = $results->fetch_row()) {	
		echo(implode("\t", $row)."\n");
	}
}


if($fmt == "mcsv"){
	$connect = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname) or die("Unable to connect to '$dbhost'");

	$filename = "modules.csv";
	$mime = "text/plain";

	header( "Content-Type: " . $mime );
	header( 'Content-Disposition: attachment; filename="' . $filename . '"' );
	$results = mysqli_query($connect, "SELECT * FROM contentsmodules"); 
	
	echo("ContentId,KeyId,UrlId,ZipName,InnerZipName,Module\n");
	while ($row = $results->fetch_row()) {	
		echo(implode(",", $row)."\n");
	}
}

if($fmt == "mtsv"){
	$connect = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname) or die("Unable to connect to '$dbhost'");

	$filename = "modules.tsv";
	$mime = "text/plain";

	header( "Content-Type: " . $mime );
	header( 'Content-Disposition: attachment; filename="' . $filename . '"' );
	$results = mysqli_query($connect, "SELECT * FROM contentsmodules"); 
	
	echo("ContentId\tKeyId\tUrlId\tZipName\tInnerZipName\tModule\n");
	while ($row = $results->fetch_row()) {	
		echo(implode("\t", $row)."\n");
	}
}

if($fmt == "ccsv"){
	$connect = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname) or die("Unable to connect to '$dbhost'");

	$filename = "content.csv";
	$mime = "text/plain";

	header( "Content-Type: " . $mime );
	header( 'Content-Disposition: attachment; filename="' . $filename . '"' );
	$results = mysqli_query($connect, "SELECT * FROM contents"); 
	
	echo("Id,Title,Desc,Type,DateAdded,TotalSize\n");
	while ($row = $results->fetch_row()) {	
		echo(implode(",", $row)."\n");
	}
}

if($fmt == "ctsv"){
	$connect = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname) or die("Unable to connect to '$dbhost'");

	$filename = "content.tsv";
	$mime = "text/plain";

	header( "Content-Type: " . $mime );
	header( 'Content-Disposition: attachment; filename="' . $filename . '"' );
	$results = mysqli_query($connect, "SELECT * FROM contents"); 
	
	echo("Id\tTitle\tDesc\tType\tDateAdded\tTotalSize\n");
	while ($row = $results->fetch_row()) {	
		echo(implode("\t", $row)."\n");
	}
}

if($fmt == "ucsv"){
	$connect = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname) or die("Unable to connect to '$dbhost'");

	$filename = "urls.csv";
	$mime = "text/plain";

	header( "Content-Type: " . $mime );
	header( 'Content-Disposition: attachment; filename="' . $filename . '"' );
	$results = mysqli_query($connect, "SELECT * FROM contentsurls"); 
	
	echo("ContentId,UrlId,UrlType,Url\n");
	while ($row = $results->fetch_row()) {	
		echo(implode(",", $row)."\n");
	}
}

if($fmt == "utsv"){
	$connect = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname) or die("Unable to connect to '$dbhost'");

	$filename = "urls.tsv";
	$mime = "text/plain";

	header( "Content-Type: " . $mime );
	header( 'Content-Disposition: attachment; filename="' . $filename . '"' );
	$results = mysqli_query($connect, "SELECT * FROM contentsurls"); 
	
	echo("ContentId\tUrlId\tUrlType\tUrl\n");
	while ($row = $results->fetch_row()) {	
		echo(implode("\t", $row)."\n");
	}
}

if($fmt == "txt"){
	$connect = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname) or die("Unable to connect to '$dbhost'");

	$filename = "urls.txt";
	$mime = "text/plain";

	header( "Content-Type: " . $mime );
	header( 'Content-Disposition: attachment; filename="' . $filename . '"' );
	$results = mysqli_query($connect, "SELECT Url FROM contentsurls"); 
	
	while ($row = $results->fetch_row()) {	
		echo($row[0]."\n");
	}
}

?>
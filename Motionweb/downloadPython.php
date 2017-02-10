<?php 
	
	if(isset($_GET["user"]))
		$user = $_GET["user"];
	else
		echo "User not set";

	$file = "pythonFiles/Motion" . $user . ".py";

	//TODO code that user will download (Could be static for now)
	$pythonCode = "print('Hello world my name is ".$user."')";

	// open file to write
	$handle = fopen($file, "w") or die("Cannot open file" . $file);

	fwrite($handle, $pythonCode);
	fclose($handle);

	// echo "Type the following in the terminal <h2> curl http://localhost/".$file." | sudo python</h2>";
 ?>
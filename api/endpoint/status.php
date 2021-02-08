<?php

	header("Content-Type: application/json");

	$api = preg_replace("/[^a-z0-9]/i","-",$_GET["api"]); // Replace special chars

	// Return the API state
	function online($online = false) {
		$isError = $online === true ? true : false;
		$message = $online === true ? "Online" : "Offline";
		$color = $online === true ? "green" : "lightgrey";

		$response = [
			"schemaVersion" => 1,
			"label" => "API",
			"message" => $message,
			"color" => $color,
			"isError" => $isError
		];

		echo json_encode($response);
	}

	function checkStatus($api) {
		if(!file_exists($api)) {
			online(false);
			return false;
		}
		
		online(true);
	}

	checkStatus($api);
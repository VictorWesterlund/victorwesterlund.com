<?php

	header("Content-Type: application/json");

	$api = $_GET["api"];

	function response($online = false) {
		$isError = $online ? true : false;
		$message = $online ? "Online" : "Offline";
		$color = $online ? "green" : "lightgrey";

		$response = [
			"schemaVersion" => 1,
			"label" => "API",
			"message" => $message,
			"color" => $color,
			"isError" => $isError
		];

		echo json_encode($response);
	}

	function getStatus() {
		if(!is_dir($api)) {
			response(false);
			return false;
		}
		
		response(true);
	}

	getStatus();
<?php

	try {
		$file = $_SERVER["REQUEST_URI"].".php";

		if(file_exists($file)) {
			require $file;
			return;
		}

		$api_root = explode("/",$_SERVER["REQUEST_URI"])[1];

		if(is_dir($api_root) && file_exists($api_root."/default.php")) {
			require $api_root."/default.php";
			return;
		}

		throw new Exception("Invalid API");
	} catch(Exception $error) {
		http_response_code("400");
		header("Content-Type: application/json");

		$output = [
			"status" => "error",
			"message" => $error->getMessage()
		];

		echo json_encode($output);
	}
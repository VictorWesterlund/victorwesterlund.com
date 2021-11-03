<?php

	require_once dirname(__DIR__,1)."/src/Globals.php";

	class APIRouter {
		public function __construct($path) {
			// List of implemented API services
			$this->services = [
				"search" => function() {
					require_once dirname(__DIR__,1)."/src/search/Search.php";
					new Search();
				}
			];

			$this->url = parse_url($path);
			$this->run();
		}

		// Find the requested service by looking at the next URI breadcrumb after "api"
		private function get_service() {
			$path = explode("/",$this->url["path"]);

			$service = array_search("api",$path) + 1; // Next array value
			$service = $path[$service];
			return $service;
		}

		private function error($message,$code = 500) {
			$output = [
				"ok" => false,
				"code" => strval($code),
				"message" => $message
			];

			header("Content-Type: application/json");
			http_response_code($code);
			echo json_encode($output);
		}

		// Run the requested service if it exists in services list
		private function run() {
			$service = $this->get_service();
			if(!array_key_exists($service,$this->services)) {
				$this->error("Inavlid API");
				return false;
			}
			// Import and run requested service
			$this->services[$service]();
		}
	}

	new APIRouter($_SERVER["REQUEST_URI"]);
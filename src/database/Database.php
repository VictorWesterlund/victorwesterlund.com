<?php

	include_once dirname(__DIR__,1)."/Globals.php";

	class Database extends mysqli {
		public function __construct($table) {
			// Load config file from this directory
			$config_path = dirname(__FILE__,1)."/config.json";
			$config = Import::json($config_path);

			parent::__construct();
			//$this->ssl_set();

			// Attempt to connect to MySQL servers in order (moving to the next on failure)
			foreach($config->servers as $server) {
				$db = $this->real_connect($server->host,$server->user,$server->pass,$server->db);
				if($db) {
					return true;
				}
			}
		}

		// Exit with error code
		private function error($message) {
			http_response_code(500);
			header("Content-Type: application/json");
			$output = json_encode([
				"error" => $message
			]);
			die($output);
		}

		// Return affected rows as an array of arrays
		protected function get_rows($sql) {
			if(!$this->ping()) {
				$this->error("No database connected");
			}

			$query = $this->query($sql);
			
			$rows = [];
			while($row = $query->fetch_row()) {
				$rows[] = $row;
			}
			return $rows;
		}
	}
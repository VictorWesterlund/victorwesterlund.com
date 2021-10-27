<?php

	include_once dirname(__DIR__,1)."/Globals.php";

	class Database extends mysqli {
		public function __construct($table) {
			// Load config file from this directory
			$config_path = dirname(__FILE__,1)."/config.json";
			$config = Import::json($config_path);

			parent::__construct();
			$this->ssl_set();

			// Attempt to connect to MySQL servers in order (moving to the next on failure)
			foreach($config->servers as $server) {
				$db = $this->real_connect($server->host,$server->user,$server->pass,$server->db);
				if($db) {
					return true;
				}
			}
		}

		protected function get_rows() {
			if(!$this->ping()) {
				return ["error" => "NO_DB"];
			}

			$query = $this->query($sql);
			
			$rows = [];
			foreach($query->fetch_row() as $row) {
				$rows[] = $row;
			}
			return $rows;
		}
	}
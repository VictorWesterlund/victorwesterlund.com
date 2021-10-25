<?php

	include_once dirname(__DIR__,1)."/Globals.php";

	class Database extends mysqli {
		public function __construct() {
			$this->config = Import::json("config.json");
		}

		private function get_server() {
			foreach($this->config->servers as $server) {
				yield $server;
			}
		}
	}
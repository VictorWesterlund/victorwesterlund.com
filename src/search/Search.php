<?php

	require_once dirname(__DIR__,1)."/Globals.php";
	require_once dirname(__DIR__,1)."/database/Database.php";

	class Search extends Database {
		public function __construct() {
			$this->query = $query;

			switch($_SERVER["HTTP_CONTENT_TYPE"]) {
				case "text/html": 
					$this->get_html(); 
					break;

				default:
				case "application/json":
					$this->get_json();
					break;
			}
		}

		private function get_html() {
			header("Content-Type: text/html");
			$template = Import::file("templates/default.html");
			echo $template;
		}

		private function get_json() {
			header("Content-Type: application/json");
			echo "{}";
		}
	}

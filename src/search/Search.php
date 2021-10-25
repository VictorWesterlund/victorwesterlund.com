<?php

	require_once dirname(__DIR__,1)."/Globals.php";
	require_once dirname(__DIR__,1)."/database/Database.php";

	class Search extends Database {
		public function __construct() {
			$this->query = $query;

			$mime_type = $_SERVER["HTTP_CONTENT_TYPE"] ? $_SERVER["HTTP_CONTENT_TYPE"] : $_GET["f"];
			switch($mime_type) {
				case "html":
				case "text/html": 
					$this->get_html(); 
					break;

				default:
				case "json":
				case "application/json":
					$this->get_json();
					break;
			}
		}

		private function get_html_template($name) {
			$path = dirname(__FILE__,1)."/templates/${name}.html";
			if(!is_file($path)) {
				return $this->get_html_template("card_error_display");
			}
			$html = Import::file($path);
			return $html;
		}

		private function get_html() {
			$results = [
				$this->get_html_template("card_default"),
				$this->get_html_template("defaults"),
				$this->get_html_template("card_default"),
				$this->get_html_template("result_about")
			];
			echo implode("",$results);
		}

		private function get_json() {
			header("Content-Type: application/json");
			echo "{}";
		}
	}

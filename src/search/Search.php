<?php

	require_once dirname(__DIR__,1)."/Globals.php";
	require_once dirname(__DIR__,1)."/database/Database.php";

	class Search extends Database {
		public function __construct() {
			parent::__construct("search");

			$this->query = $this->real_escape_string($query);

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

		private function get_results() {
			$sql = "SELECT id,template,content FROM `search` WHERE `content` LIKE '%{$this->query}%'";
			$query = $this->query($sql);
			if(!$query->num_rows()) {
				return false;
			}
			return $query->fetch_assoc();
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

			header("Content-Type: text/html");
			echo implode("",$results);
		}

		private function get_json() {
			$data = [
				"results" => []
			];
			$json = json_encode($data);

			header("Content-Type: application/json");
			echo $json;
		}
	}

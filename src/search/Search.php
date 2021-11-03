<?php

	require_once dirname(__DIR__,1)."/Globals.php";
	require_once dirname(__DIR__,1)."/database/Database.php";

	class Search extends Database {
		public function __construct() {
			parent::__construct("search");

			$this->query = $this->real_escape_string($_GET["q"]); // Escape the user-provided query

			// Determine response type from request header or search param
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

		// Perform a seach on the given query and return the results as an array
		private function get_results() {
			$sql = "SELECT template,title,content,href FROM `search` WHERE `title` LIKE '%{$this->query}%' OR `content` LIKE '%{$this->query}%'";
			$rows = $this->get_rows($sql);
			return $rows;
		}

		// Load HTML template from disk
		private function get_html_template($name) {
			$path = dirname(__FILE__,1)."/templates/${name}.html";
			if(!is_file($path)) {
				return $this->get_html_template("card_error_display");
			}
			$html = Import::file($path);
			return $html;
		}

		// Return query as HTML from templates
		private function get_html() {
			$results = $this->get_results();
			
			if(count($results) < 1) {
				$results[] = ["message","info","no results 😞"];
			}

			// Load HTML and format each response from template
			$results = array_map(function($result) {
				// Use first row as template name
				$template = $this->get_html_template($result[0]);
				// Use remaining rows as format arguments
				$format = array_shift($result);
				return sprintf($template,...$result);
			},$results);

			header("Content-Type: text/html");
			echo implode("",$results);
		}

		// Return query as JSON
		private function get_json() {
			$results = $this->get_results();
			$data = [
				"results" => []
			];

			// Assign custom keys to each value (not db columns)
			foreach($results as $result) {
				$data["results"][] = [
					"html_template" => $result[0],
					"title" => $result[1],
					"content" => $result[2],
					"href" => $result[3]
				];
			}

			$json = json_encode($data);
			header("Content-Type: application/json");
			echo $json;
		}
	}

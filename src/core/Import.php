<?php

	class Import {
		// Import assets from disk
		public static function file($file) {
			$content = file_get_contents($file);
			return $content;
		}

		// Import JSON to PHP list
		public static function json($file) {
			$contents = Import::file($file);
			$json = json_decode($contents);
			return $json;
		}
	}
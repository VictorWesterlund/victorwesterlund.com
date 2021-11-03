<?php

	class Import {
		public static function file($file) {
			$content = file_get_contents($file);
			return $content;
		}

		public static function json($file) {
			$contents = Import::file($file);
			$json = json_decode($contents);
			return $json;
		}
	}
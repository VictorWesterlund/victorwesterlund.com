<?php

	$gif = imagecreatefromgif("./pattern.gif");

	header("Content-Type: image/gif");

	imagegif($gif);
	imagedestroy($gif);
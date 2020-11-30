<?php

	http_response_code("503 Service Unavailable");
	header("Content-Type: text/plain");
	echo "Not available yet";
<?php
header('Content-Type: application/json');

$path = isset($_GET['path']) ? $_GET['path'] : '';
$query = $_SERVER['QUERY_STRING'];

// Usuń 'path' z query string
parse_str($query, $params);
unset($params['path']);
$cleanQuery = http_build_query($params);

$url = 'https://pim.davis.pl/api/' . $path;
if ($cleanQuery) {
    $url .= '?' . $cleanQuery;
}

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

http_response_code($httpCode);
echo $response;

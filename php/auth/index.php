<?php

declare(strict_types=1);
// header('Content-type:application/json;charset=utf-8');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header('Content-Type: application/json');


if ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['generate_token'])) {
    $token = generateApiToken();
    echo json_encode(['token' => $token]);
    exit;
}

// API endpoint for checking if an API token is valid
if ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['check_token'])) {
    $token_to_check = $_GET['check_token'];
    $isValid = isApiTokenValid($token_to_check);
    echo json_encode(['valid' => $isValid]);
    exit;
}
// Function to generate a new API token with a 5-minute expiration
function generateApiToken()
{
    include "../config/index.php";

    // Generate a random token
    $token = bin2hex(random_bytes(32));

    // Set the token and expiration date in the database (5 minutes from now)
    $expiration = time() + 300;
    $query_User_re = sprintf("INSERT INTO api_tokens (token, expiration) VALUES ('$token', '$expiration')");
    $User_re = mysqli_query($ibsConnection, $query_User_re) or die(mysqli_error($ibsConnection));
    
    return $token;
}

// Function to check if an API token is valid
function isApiTokenValid($token)
{
 include "../config/index.php";

    // Check if the token exists and is not expired in the database
    $current_time = time();
    $query = "SELECT token FROM api_tokens WHERE token = '$token' AND expiration > $current_time LIMIT 1";
    $result = mysqli_query($ibsConnection, $query);

    return (mysqli_num_rows($result) > 0);
}



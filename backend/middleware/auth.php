<?php
header("Content-Type: application/json");

require_once "./../config/env.php"; 

$authHeader = '';

if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
} elseif (function_exists('getallheaders')) {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? '';
}

// Validate Bearer token
if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    http_response_code(401);
    echo json_encode(["error" => "No token provided"]);
    exit;
}

$token = $matches[1];

// Query DB
$stmt = $conn->prepare("SELECT user_id, user_type
    FROM auth_users
    WHERE auth_token = ? AND token_expires_at > NOW()
    LIMIT 1
");
$stmt->bind_param("s", $token);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(401);
    echo json_encode(["error" => "Invalid or expired session"]);
    exit;
}

$authUser = $result->fetch_assoc();

// Make available globally
$LOGGED_IN_USER_ID   = $authUser['user_id'];
$LOGGED_IN_USER_TYPE = $authUser['user_type'];

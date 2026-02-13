<?php
header("Content-Type: application/json");
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');
require_once "./../config/env.php"; 

// Read JSON input
$input = json_decode(file_get_contents("php://input"), true);

$username = trim($input['username'] ?? '');
$password = $input['password'] ?? '';

// Basic validation
if ($username === '' || $password === '') {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "Username and password are required"
    ]);
    exit;
}

// Fetch auth user
$stmt = $conn->prepare("
    SELECT 
        id,
        username,
        user_type,
        user_id,
        password_hash
    FROM auth_users
    WHERE username = ?
    LIMIT 1
");

$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(401);
    echo json_encode([
        "status" => "error",
        "message" => "Invalid username or password"
    ]);
    exit;
}

$user = $result->fetch_assoc();

// Verify password
if (!password_verify($password, $user['password_hash'])) {
    http_response_code(401);
    echo json_encode([
        "status" => "error",
        "message" => "Invalid username or password"
    ]);
    exit;
}

//  Generate token
$token  = bin2hex(random_bytes(32));
$expiry = date("Y-m-d H:i:s", strtotime("+1 day"));

// Save token
$update = $conn->prepare("
    UPDATE auth_users
    SET auth_token = ?, token_expires_at = ?
    WHERE id = ?
");

$update->bind_param("ssi", $token, $expiry, $user['id']);
$update->execute();

// ✅ Success response
echo json_encode([
    "status"    => "success",
    "message"  => "Login successful",
    "token"    => $token,
    "user_role"=> $user['user_type'], // admin | staff | agent
    "user_id"  => $user['user_id'],
    "username" => $user['username'],
]);

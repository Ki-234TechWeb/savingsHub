<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');
include './../config/db.php';
$input = file_get_contents("php://input");
$data = json_decode($input, true);

$name      = htmlspecialchars(trim($data['name'] ?? ''), ENT_QUOTES, 'UTF-8');
$email     = htmlspecialchars(trim($data['email'] ?? ''), ENT_QUOTES, 'UTF-8');
$phone     = htmlspecialchars(trim($data['phone'] ?? ''), ENT_QUOTES, 'UTF-8');
$address   = htmlspecialchars(trim($data['address'] ?? ''), ENT_QUOTES, 'UTF-8');
$nextofKin = htmlspecialchars(trim($data['nextofKin'] ?? ''), ENT_QUOTES, 'UTF-8');
$agent     = htmlspecialchars(trim($data['agent'] ?? ''), ENT_QUOTES, 'UTF-8');
$password  = htmlspecialchars(trim($data['password'] ?? ''), ENT_QUOTES, 'UTF-8');
$actor_type = "staff";
$agent_id = htmlspecialchars(trim($data['agent_id'] ?? ''), ENT_QUOTES, 'UTF-8');
$target_tb = "Users";
$action_type = "New User";
$message = "Agent $agent Successfully Created New User $name ";
$response = [];

// Validation
if (empty($name) || empty($phone) || empty($address) || empty($password) || empty($nextofKin)) {
    $response = [
        "status"  => "error",
        "message" => "Required field cannot be empty",
        "code"    => 400
    ];
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $response = [
        "status"  => "error",
        "message" => "Invalid email format",
        "code"    => 422
    ];
} elseif (strlen($password) < 6) {
    $response = [
        "status"  => "error",
        "message" => "Password cannot be less than 6 characters",
        "code"    => 422
    ];
} else {

// Check if email already exists
$check = $conn->prepare("SELECT user_id FROM users WHERE name = ?");
$check->bind_param("s", $name);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    $response = [
        "status"  => "error",
        "message" => "User name already exist, Try adding a prifix or business name",
        "code"    => 409 // Conflict
    ];
    echo json_encode($response);
    exit;
}
$check->close();


    try {
        // Hash password
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        // Prepare SQL
        $stmt = $conn->prepare(
            "INSERT INTO users (name, email, phone, address, password, agent, agent_id) 
             VALUES (?, ?, ?, ?, ?, ?, ?)"
        );

        $stmt->bind_param("sssssss", $name, $email, $phone, $address, $hashed_password, $agent, $agent_id);

        if ($stmt->execute()) {
            $response = [
                "status"  => "success",
                "message" => "Successfully created account for $name",
                "code"    => 200
            ];
    // notification Insert
            $stmtNotify = $conn->prepare("INSERT INTO notifications (actor_type, actor_id, action,	target_table,target_id, message) VALUES (?, ?, ?, ?, ?, ?)");
$stmtNotify->bind_param('sissis',$actor_type, $agent_id, $action_type,$target_tb,$user_id, $message);
$stmtNotify->execute();
        } else {
            $response = [
                "status"  => "error",
                "message" => "Database insert failed: " . $stmt->error,
                "code"    => 500
            ];
        }

        $stmt->close();
    
    } catch (\Throwable $th) {
        $response = [
            "status"  => "error",
            "message" => "Server error: " . $th->getMessage(),
            "code"    => 500
        ];
    }
}

echo json_encode($response);

?>
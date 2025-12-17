<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');
include './../config/db.php';

$input = file_get_contents("php://input");
$data = json_decode($input, true);

$user         = htmlspecialchars(trim($data['user'] ?? ''), ENT_QUOTES, 'UTF-8');
$userId         = htmlspecialchars(trim($data['userId'] ?? ''), ENT_QUOTES, 'UTF-8');
$agentId         = htmlspecialchars(trim($data['agentId'] ?? ''), ENT_QUOTES, 'UTF-8');
$planType     = htmlspecialchars(trim($data['planType'] ?? ''), ENT_QUOTES, 'UTF-8');
$targetAmount = htmlspecialchars(trim($data['targetAmount'] ?? ''), ENT_QUOTES, 'UTF-8');
$duration     = htmlspecialchars(trim($data['duration'] ?? ''), ENT_QUOTES, 'UTF-8');
$contribution = htmlspecialchars(trim($data['contribution'] ?? ''), ENT_QUOTES, 'UTF-8');
$Commision = htmlspecialchars(trim($data['Commision'] ?? ''), ENT_QUOTES, 'UTF-8');
$actor_type = "staff";
$target_tb = "Users";
$action_type = "set plan";
$message = "Agent $agentId Successfully Set New Plan for $user ";
$response = [];

// Validation
if (empty($user) || empty($planType) || empty($duration) || empty($Commision) || empty($targetAmount) || empty($contribution)) {
    $response = [
        "status"  => "error",
        "message" => "Required field cannot be empty",
        "code"    => 400
    ];
} else {
    try {
        // Prepare SQL (no trailing comma, 5 placeholders)
        $stmt = $conn->prepare(
            "INSERT INTO userplans (user_id,user_name, plan_type,Commision, target_amount, duration_months, contribution_per_cycle,agent_id) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        );

        $stmt->bind_param("issiiiii",  $userId ,$user, $planType, $Commision, $targetAmount, $duration, $contribution,  $agentId);

        if ($stmt->execute()) {
            $response = [
                "status"  => "success",
                "message" => "Successfully set plans for $user",
                "code"    => 200
            ];
             // notification Insert
            $stmtNotify = $conn->prepare("INSERT INTO notifications (actor_type, actor_id, action,	target_table,target_id, message) VALUES (?, ?, ?, ?, ?, ?)");
$stmtNotify->bind_param('sissis',$actor_type, $agentId, $action_type,$target_tb,$userId, $message);
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

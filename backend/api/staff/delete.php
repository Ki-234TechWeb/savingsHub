<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');
include './../config/env.php';
$input = file_get_contents("php://input");
$data = json_decode($input, true);
$plan_id = htmlspecialchars(trim($data['deleteId'] ?? ''), ENT_QUOTES, 'UTF-8');
$agent_id = htmlspecialchars(trim($data['deleteAgentId'] ?? ''), ENT_QUOTES, 'UTF-8');
$user_name = htmlspecialchars(trim($data['deleteId'] ?? ''), ENT_QUOTES, 'UTF-8');
$actor_type = "staff";
$target_tb = "Users";
$action_type = "Delete plan";
$message = "Agent $agent_id Successfully Delete A Plan for $user_name  ";
$response = [];
if (empty($plan_id)) {
     $response = [
        "status" => "error",
        "message" => "Invalid or missing plan id",
        "code" => 400
    ];
    echo json_encode($response);
    exit;
}
else{
try {
        // Prepare SQL (no trailing comma, 5 placeholders)
        $stmt = $conn->prepare(
    "DELETE FROM userplans 
     WHERE user_plan_id = ?"
);


        $stmt->bind_param("i", $plan_id);

        if ($stmt->execute()) {
            $response = [
                "status"  => "success",
                "message" => "Successfully deleted A plan for $user_name",
                "code"    => 200
            ];
             // notification Insert
            $stmtNotify = $conn->prepare("INSERT INTO notifications (actor_type, actor_id, action,	target_table, message) VALUES (?, ?, ?, ?, ?)");
$stmtNotify->bind_param('sisss',$actor_type, $agent_id, $action_type,$target_tb,$message);
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
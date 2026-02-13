<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');
include './../config/env.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require __DIR__ . '/../../../vendor/autoload.php';
$input = file_get_contents("php://input");
$data = json_decode($input, true);
$response = [];

$userPlanId = (int)($data['userPlanId'] ?? 0);
$user_id    = (int)($data['userId'] ?? 0);

if ($userPlanId <= 0 || $user_id <= 0) {
    $response = [
        "status"  => "error",
        "message" => "Invalid or missing IDs",
        "code"    => 400
    ];
} else {

    $stmt = $conn->prepare("
        UPDATE userplans
        SET
            withdrawn_at = NOW(),
            status = 'payment approved'
        WHERE user_plan_id = ? AND user_id = ?
    ");

    $stmt->bind_param("is", $userPlanId, $user_id);

    if ($stmt->execute()) {
        $response = [
            "status"  => "success",
            "message" => "Payment approved successfully"
        ];
    } else {
        $response = [
            "status"  => "error",
            "message" => "Failed to approve payment"
        ];
    }

    $stmt->close();
}


echo json_encode($response);

?>
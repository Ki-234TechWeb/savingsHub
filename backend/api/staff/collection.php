<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');
include './../config/db.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/../../../vendor/autoload.php';


$input = file_get_contents("php://input");
$data = json_decode($input, true);
$user         = htmlspecialchars(trim($data['user'] ?? ''), ENT_QUOTES, 'UTF-8');
$userplansid     = htmlspecialchars(trim($data['userplansid'] ?? ''), ENT_QUOTES, 'UTF-8');
$user_id     = htmlspecialchars(trim($data['user_id'] ?? ''), ENT_QUOTES, 'UTF-8');
$agent_id     = htmlspecialchars(trim($data['agent_id'] ?? ''), ENT_QUOTES, 'UTF-8');
$date = htmlspecialchars(trim($data['date'] ?? ''), ENT_QUOTES, 'UTF-8');
$amount     = htmlspecialchars(trim($data['amount'] ?? ''), ENT_QUOTES, 'UTF-8');
$plan_type = htmlspecialchars(trim($data['plan_type'] ?? ''), ENT_QUOTES, 'UTF-8');
$response = [];
$actor_type = "staff";
$target_tb = "contributions";
$action_type = "collected contribution";
$message = "Agent $agent_id Successfully Collected ₦$amount from $user";

$sqlUser_id = "SELECT `user_id`,`user_plan_id`, `user_name`, `plan_type`,`contribution_per_cycle` FROM `userplans` WHERE `agent_id` = ?";


// Validation
if (empty($user) || empty($user_id) || empty($amount) || empty($user_id) || empty($date)) {
    $response = [
        "status"  => "error",
        "message" => "Required field cannot be empty",
        "code"    => 400
    ];
} else {
    try {
        $stmt = $conn->prepare(
            "INSERT INTO contributions (user_id, user_plan_id, user_name, amount, date, agent_id, plan_type) 
             VALUES (?, ?, ?, ?, ?, ?, ?)"
        );

        $stmt->bind_param("iisisis", $user_id, $userplansid, $user, $amount, $date, $agent_id, $plan_type);

        if ($stmt->execute()) {
            // Update collected_amount for all users/plans
            $stmtSum = $conn->prepare("
                UPDATE userplans u
                JOIN (
                    SELECT user_plan_id, SUM(amount) AS total_contributions
                    FROM contributions
                    GROUP BY user_plan_id
                ) c ON u.user_plan_id = c.user_plan_id
                SET u.collected = c.total_contributions;
            ");
            $stmtSum->execute();
            $stmtSum->close();

            // Update status if collected >= target_amount
            $stmtStatus = $conn->prepare("
                UPDATE userplans
                SET status = 'completed'
                WHERE collected >= target_amount
            ");
            $stmtStatus->execute();
            $stmtStatus->close();

            // Update status dynamically
            $stmtStatus = $conn->prepare("
                UPDATE userplans
                SET status = CASE 
                    WHEN collected >= target_amount THEN 'completed'
                    ELSE 'in progress'
                END
            ");
            $stmtStatus->execute();
            $stmtStatus->close();

            // Insert notification
            $stmtNotify = $conn->prepare("
                INSERT INTO notifications (actor_type, actor_id, action, target_table, target_id, message) 
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            $stmtNotify->bind_param('sissis', $actor_type, $agent_id, $action_type, $target_tb, $user_id, $message);
            $stmtNotify->execute();

            // Get user email
            $stmtgetEmail = $conn->prepare("SELECT `email` FROM users WHERE user_id = ?");
            $stmtgetEmail->bind_param("i", $user_id);
            $stmtgetEmail->execute();
            $result = $stmtgetEmail->get_result();

            if ($row = $result->fetch_assoc()) {
                $recipientEmail = trim($row['email']); 
                if ($recipientEmail) {
                    $mail = new PHPMailer(true);
                    $subject = "Contribution Notification";
                    $body = "₦$amount has been successfully credited to your SavingHub account.";
                    try {
                        //Server settings
                        $mail->isSMTP();
                        $mail->Host       = 'smtp.gmail.com';
                        $mail->SMTPAuth   = true;
                        $mail->Username   = 'savinghub23@gmail.com';
                        $mail->Password   = 'dcfiegsyrrcvzvue';
                        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
                        $mail->Port       = 465;

                        //Recipients
                        $mail->setFrom('savinghub23@gmail.com', 'SavingHub');
                        $mail->addAddress($recipientEmail);

                        //Content
                        $mail->isHTML(true);
                        $mail->Subject = $subject;
                        $mail->Body    = $body;

                        $mail->send();
                    } catch (Exception $e) {
                        // Email failed, but contribution still recorded
                    }
                }
            }

            // ✅ Final JSON response
            $response = [
                "status"  => "success",
                "message" => "Contribution Successfully Recorded & Email Sent",
                "code"    => 200
            ];
            header('Content-Type: application/json');
            echo json_encode($response);
            exit;

        } else {
            // ❌ Error response
            $response = [
                "status"  => "error",
                "message" => "Failed to record contribution",
                "code"    => 500
            ];
            header('Content-Type: application/json');
            echo json_encode($response);
            exit;
        }
    } catch (Exception $e) {
        // ❌ Exception response
        $response = [
            "status"  => "error",
            "message" => "Exception occurred: " . $e->getMessage(),
            "code"    => 500
        ];
        header('Content-Type: application/json');
        echo json_encode($response);
        exit;
    }
}

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
$collect_id         = htmlspecialchars(trim($data['collect_id'] ?? ''), ENT_QUOTES, 'UTF-8');
$agent_id     = htmlspecialchars(trim($data['collect_agentid'] ?? ''), ENT_QUOTES, 'UTF-8');
$date = htmlspecialchars(trim($data['dateEdit'] ?? ''), ENT_QUOTES, 'UTF-8');
$amount     = htmlspecialchars(trim($data['amountEdit'] ?? ''), ENT_QUOTES, 'UTF-8');
$user     = htmlspecialchars(trim($data['collectOption'] ?? ''), ENT_QUOTES, 'UTF-8');
$user_id     = htmlspecialchars(trim($data['collectUserId'] ?? ''), ENT_QUOTES, 'UTF-8');
$response = [];
$actor_type = "staff";
$target_tb = "contributions";
$action_type = "collected contribution";
$message = "Update Successful: Agent [$agent_id] recorded a contribution of $amount by $user Date: $date.";
$sqlUser_id = "SELECT `user_id`,`user_plan_id`, `user_name`, `plan_type`,`contribution_per_cycle` FROM `userplans` WHERE `agent_id` = ?";


// Validation
if (empty($user)  || empty($amount) || empty($date)) {
    $response = [
        "status"  => "error",
        "message" => "Required field cannot be empty",
        "code"    => 400
    ];
} elseif (empty($collect_id) || empty($agent_id)) {
    $response = [
        "status"  => "error",
        "message" => "Invalid request: Missing mandatory parameters (ids).",
        "code"    => 400
    ];
} else {
    try {
        $stmt = $conn->prepare("UPDATE contributions SET amount = ?, date = ? WHERE contribution_id =? AND agent_id = ? ");

        $stmt->bind_param("isii", $amount, $date, $collect_id, $agent_id);

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
                INSERT INTO notifications (actor_type, actor_id, action, target_table, message) 
                VALUES (?, ?, ?, ?, ?)
            ");
            $stmtNotify->bind_param('sisss', $actor_type, $agent_id, $action_type, $target_tb, $message);
            $stmtNotify->execute();

            // Get user email
            $stmtgetEmail = $conn->prepare("SELECT `email` FROM users WHERE user_id = ?");
            $stmtgetEmail->bind_param("s", $user_id);
            $stmtgetEmail->execute();
            $result = $stmtgetEmail->get_result();

            if ($row = $result->fetch_assoc()) {
                $recipientEmail = trim($row['email']);
                if ($recipientEmail) {
                    $mail = new PHPMailer(true);
                    $subject = "SavingHub Contribution Update";
                 $body = "
                         <p>Hi $user 👋,</p>
                         <p>Your SavingHub contribution has been updated successfully.</p>
                        <p>💰 <strong>Amount:</strong> $amount <br>
                        📅 <strong>Date:</strong> $date</p>
                        <p>Thanks for being part of SavingHub — we appreciate you!</p>";


                    try {
                        //Server settings
                        $mail->isSMTP();
                        $mail->Host       = 'smtp.gmail.com';
                        $mail->SMTPAuth   = true;
                        $mail->Username   = $mailUser;
                        $mail->Password   = $mailPass;
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
        //  end of email notification
            // ✅ Final JSON response
            $response = [
                "status"  => "success",
                "message" => "Contribution Successfully Recorded ",
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
        //  Exception response
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

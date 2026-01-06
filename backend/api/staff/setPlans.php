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
            $stmtNotify->bind_param('sissis', $actor_type, $agentId, $action_type, $target_tb, $userId, $message);
            $stmtNotify->execute();

            // Get user email
            $stmtgetEmail = $conn->prepare("SELECT `email` FROM users WHERE user_id = ?");
            $stmtgetEmail->bind_param("s", $userId);
            $stmtgetEmail->execute();
            $result = $stmtgetEmail->get_result();

            if ($row = $result->fetch_assoc()) {
                $recipientEmail = trim($row['email']);
                if ($recipientEmail) {
                    $mail = new PHPMailer(true);
                    $subject = "SavingHub Plan Setup Successful ";

                    $body = "
    <p>Hi $user 👋,</p>
    <p>✅ Your SavingHub plan has been set up successfully.</p>

    <h3>📋 Plan Details</h3>
    <p>
        🏦 <strong>Plan Type:</strong> $planType <br>
        🎯 <strong>Target Amount:</strong> ₦$targetAmount <br>
        ⏳ <strong>Duration:</strong> $duration Month(s) <br>
        💰 <strong>Contribution per Cycle:</strong> ₦$contribution
    </p>

    <p>🎉 Thank you for choosing SavingHub — we’re excited to help you reach your savings goals!</p>
    <p>— The SavingHub Team</p>
";



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

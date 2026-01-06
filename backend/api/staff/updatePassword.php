<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');

include './../config/env.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/../../../vendor/autoload.php';

$data = json_decode(file_get_contents("php://input"), true);
$currentPassword = trim($data['currentPassword'] ?? '');
$newPassword     = trim($data['newPassword'] ?? '');
$agent_id        = (int)($data['StaffId'] ?? 0);

$response = [];

// Step 1: Fetch current hashed password from DB
$getPass = $conn->prepare("SELECT password FROM agents WHERE agent_id = ?");
$getPass->bind_param("i", $agent_id);
$getPass->execute();
$getPass->bind_result($currentHashedPassword);
$getPass->fetch();
$getPass->close();

if (!$currentHashedPassword) {
    $response = ["status" => "error", "message" => "Agent not found."];
    echo json_encode($response);
    exit;
}

// Step 2: Verify current password
if (!password_verify($currentPassword, $currentHashedPassword)) {
    $response = ["status" => "error", "message" => "Current password is incorrect."];
    echo json_encode($response);
    exit;
}

// Step 3: Validate new password
if (strlen($newPassword) < 6) {
    $response = ["status" => "error", "message" => "New password must be at least 6 characters long."];
    echo json_encode($response);
    exit;
}

// Step 4: Hash new password
$newHashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

// Step 5: Update DB
$updatePass = $conn->prepare("UPDATE agents SET password = ? WHERE agent_id = ?");
$updatePass->bind_param("si", $newHashedPassword, $agent_id);

if ($updatePass->execute()) {
    $response = ["status" => "success", "message" => "Password updated successfully."];

$stmtgetEmail = $conn->prepare("SELECT `email`,`name` FROM agents WHERE agent_id = ?");
            $stmtgetEmail->bind_param("i", $agent_id);
            $stmtgetEmail->execute();
            $result = $stmtgetEmail->get_result();

            if ($row = $result->fetch_assoc()) {
                $recipientEmail = trim($row['email']);
                $recipientName = trim($row['name']);
                if ($recipientEmail) {
                    $mail = new PHPMailer(true);
                    $subject = "SavingHub Account Password Update";
                    $body = "
                    <p>👋 Dear $recipientName,</p>
                    <p>✅ Your SavingHub account password has been successfully updated.</p>
                    <p>If you did not request this change, please contact our support team immediately.</p>";


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

// end of email notification

} else {
    $response = ["status" => "error", "message" => "Failed to update password."];
}

$updatePass->close();
$conn->close();

// Step 6: Return JSON response
echo json_encode($response);
?>

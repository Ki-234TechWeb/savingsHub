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

$agent_id = htmlspecialchars(trim($data['agent_id'] ?? ''), ENT_QUOTES, 'UTF-8');
$user_id  = htmlspecialchars(trim($data['userId'] ?? ''), ENT_QUOTES, 'UTF-8');
$agent    = htmlspecialchars(trim($data['agent'] ?? ''), ENT_QUOTES, 'UTF-8');
$actor_type = "admin";

$target_tb = "Users";
$action_type = " assigned agent";
$message = "$actor_type Successfully assigned $agent to  $user_id ";
if (empty($agent_id) || empty($user_id) || empty($agent)) {
    $response = [
        "status"  => "error",
        "message" => "Invalid or missing IDs",
        "code"    => 400
    ];
} else {
    $stmt = $conn->prepare("UPDATE users SET agent = ?, agent_id = ? WHERE user_id = ?");
$stmt->bind_param('sss', $agent, $agent_id, $user_id);

if ($stmt->execute()) {
    $stmtuserplan = $conn->prepare("UPDATE userplans SET agent_id = ? WHERE user_id = ?");
    $stmtuserplan->bind_param('ss', $agent_id, $user_id);

    if ($stmtuserplan->execute()) {
        $response = [
            "status"  => "success",
            "message" => "Successfully assigned $agent to user ",
            "code"    => 200
        ];
       
         // notification Insert
            $stmtNotify = $conn->prepare("INSERT INTO notifications (actor_type, actor_id, action,	target_table,target_id, message) VALUES (?, ?, ?, ?, ?, ?)");
            $stmtNotify->bind_param('ssssss', $actor_type, $agent_id, $action_type, $target_tb, $user_id, $message);
            $stmtNotify->execute();

            // Get user email/name
            $stmtgetEmail = $conn->prepare("SELECT `email`,`name` FROM users WHERE user_id = ?");
            $stmtgetEmail->bind_param("s", $user_id);
            $stmtgetEmail->execute();
            $result = $stmtgetEmail->get_result();

            if ($row = $result->fetch_assoc()) {
                $recipientEmail = trim($row['email']);
                $name = trim($row['name']);
                if ($recipientEmail) {
                    $mail = new PHPMailer(true);
                    $subject = "SavingHub Account Update";
                    $body = "
                    <p>&#128075; Dear $name,</p>

<p>&#9989; We’re happy to inform you that a dedicated agent has been assigned to your SavingHub account.</p>

<h3>👤 Assigned Agent </h3>
<p>
  <strong>Agent Name:</strong> $agent <br>

</p>

<p>🤝 Your assigned agent is available to support you and guide you through your savings journey.</p>

<p>&#127881; Thank you for saving with us!</p>

<p>— The SavingHub Team</p>";


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








    } else {
        $response = [
            "status"  => "error",
            "message" => "Failed to update userplans",
            "code"    => 500
        ];
    }

    $stmtuserplan->close();
} else {
    $response = [
        "status"  => "error",
        "message" => "Failed to update users",
        "code"    => 500
    ];
}

$stmt->close();

}

echo json_encode($response);

?>
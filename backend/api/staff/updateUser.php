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

$name      = htmlspecialchars(trim($data['name'] ?? ''), ENT_QUOTES, 'UTF-8');
$email     = htmlspecialchars(trim($data['email'] ?? ''), ENT_QUOTES, 'UTF-8');
$phone     = htmlspecialchars(trim($data['phone'] ?? ''), ENT_QUOTES, 'UTF-8');
$address   = htmlspecialchars(trim($data['address'] ?? ''), ENT_QUOTES, 'UTF-8');
$nextofKin = htmlspecialchars(trim($data['nextofKin'] ?? ''), ENT_QUOTES, 'UTF-8');
$agent     = htmlspecialchars(trim($data['agent'] ?? ''), ENT_QUOTES, 'UTF-8');
$actor_type = "staff";
$agent_id = htmlspecialchars(trim($data['agent_id'] ?? ''), ENT_QUOTES, 'UTF-8');
$user_id = (int)($data['user_id'] ?? 0);

$target_tb = "Users";
$action_type = " User update";
$message = " Successfully Updated  User info ";
$response = [];

// Validation
if (empty($name) || empty($phone) || empty($address)) {
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
} else {


    if ($user_id === 0) {
        $response = [
            "status" => "error",
            "message" => "Invalid or missing user_id",
            "code" => 400
        ];
        echo json_encode($response);
        exit;
    }

    // Check if name already exists
    // Check duplicate agent name
    $check = $conn->prepare(
        "SELECT user_id FROM users WHERE name = ? AND user_id != ?"
    );
    $check->bind_param("ss", $name, $user_id);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {
        echo json_encode([
            "status" => "error",
            "message" => "User name already exists. Try adding a prefix or business name.",
            "code" => 409
        ]);
        exit;
    }
    $check->close();



    try {

        // Prepare SQL
        $stmt = $conn->prepare(
            "UPDATE users SET name = ?, email = ?, phone = ?, address = ?, nextofkin = ? WHERE user_id = ?"
        );

        $stmt->bind_param("sssssi", $name, $email, $phone, $address, $nextofKin, $user_id);

        if ($stmt->execute()) {
            $response = [
                "status"  => "success",
                "message" => "Successfully Updated  User info ",
                "code"    => 200
            ];
            // notification Insert
            $stmtNotify = $conn->prepare("INSERT INTO notifications (actor_type, actor_id, action,	target_table,target_id, message) VALUES (?, ?, ?, ?, ?, ?)");
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
                    $subject = "SavingHub Account Update";
                    $body = "
                    <p>&#128075; Dear $name,</p>
                    <p>&#9989; Your SavingHub account has been successfully updated.</p>
                    <h3>📋 Account Details</h3>
                    <p><strong>Name:</strong> $name <br>
                    <strong>Email:</strong> $email <br>
                    <strong>Phone:</strong> $phone <br>
                    <strong>Address:</strong> $address <br>
                    <strong>Next of Kin:</strong> $nextofKin</p>
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

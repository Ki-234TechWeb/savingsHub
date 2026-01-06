<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');

include './../config/env.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require __DIR__ . '/../../../vendor/autoload.php';

$data = json_decode(file_get_contents("php://input"), true);

// Raw inputs (NO htmlspecialchars here)
$nameToSave = trim($data['nameToSave'] ?? '');
$name       = trim($data['name'] ?? '');
$phone      = trim($data['phone'] ?? '');
$address    = trim($data['address'] ?? '');
$agent_id   = (int)($data['StaffId'] ?? 0);
$actor_type = "agent";
$target_tb  = "agents";
$action_type = "Profile Update";
$message = "Profile updated (Agent ID: $agent_id).";

// Basic validation
if (!$agent_id || empty($nameToSave) || empty($phone) || empty($address)) {
    echo json_encode([
        "status" => "error",
        "message" => "Required fields cannot be empty",
        "code" => 400
    ]);
    exit;
}

// Check duplicate agent name
$check = $conn->prepare(
    "SELECT agent_id FROM agents WHERE name = ? AND agent_id != ?"
);
$check->bind_param("si", $nameToSave, $agent_id);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    echo json_encode([
        "status" => "error",
        "message" => "Agent name already exists. Try adding a prefix or business name.",
        "code" => 409
    ]);
    exit;
}
$check->close();


// Update profile
$stmt = $conn->prepare(
    "UPDATE agents 
     SET name = ?, phone = ?, address = ?
     WHERE agent_id = ?"
);
$stmt->bind_param(
    "sssi",
    $nameToSave,
    $phone,
    $address,
    $agent_id
);

if ($stmt->execute()) {
    // Notification
    $notify = $conn->prepare(
        "INSERT INTO notifications 
        (actor_type, actor_id, action, target_table, message)
        VALUES (?, ?, ?, ?, ?)"
    );
    $notify->bind_param(
        "sisss",
        $actor_type,
        $agent_id,
        $action_type,
        $target_tb,
        $message
    );
    $notify->execute();

    echo json_encode([
        "status" => "success",
        "message" => "Profile updated successfully",
        "code" => 200
    ]);

    
            // Get user email
            $stmtgetEmail = $conn->prepare("SELECT `email`,`name` FROM agents WHERE agent_id = ?");
            $stmtgetEmail->bind_param("s", $agent_id);
            $stmtgetEmail->execute();
            $result = $stmtgetEmail->get_result();

    if ($row = $result->fetch_assoc()) {
        $recipientEmail = trim($row['email']);
        $recipientName = trim($row['name']);
        if ($recipientEmail) {
            $mail = new PHPMailer(true);
            $subject = "SavingHub Profile Update";
            $body = "
    <p>👋 Hi $recipientName,</p>
    <p>✅ Your SavingHub account profile has been updated successfully.</p>

    <h3>📋 Updated Profile Information</h3>
    <p><strong>Name:</strong> $nameToSave <br>
       <strong>Phone:</strong> $phone <br>
       <strong>Address:</strong> $address</p>

    <p>🎉 Thank you for staying with SavingHub!</p>
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

} else {
    echo json_encode([
        "status" => "error",
        "message" => "Update failed",
        "code" => 500
    ]);
}

$stmt->close();

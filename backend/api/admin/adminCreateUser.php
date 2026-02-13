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
$password  = htmlspecialchars(trim($data['password'] ?? ''), ENT_QUOTES, 'UTF-8');
$actor_type = "Admin";
$agent_id = htmlspecialchars(trim($data['agent_id'] ?? ''), ENT_QUOTES, 'UTF-8');
$target_tb = "user";
$action_type = "New User";
$message = "Admn Successfully Created New User: $name ";
$response = [];

// Validation
if (empty($name) || empty($phone) || empty($address) || empty($password) || empty($nextofKin)) {
    $response = [
        "status"  => "error",
        "message" => "Required field cannot be empty",
        "code"    => 400
    ];
} elseif (!empty($email) && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $response = [
        "status"  => "error",
        "message" => "Invalid email format",
        "code"    => 422
    ];
}
 elseif (strlen($password) < 6) {
    $response = [
        "status"  => "error",
        "message" => "Password cannot be less than 6 characters",
        "code"    => 422
    ];
} else {

    // Check if name already exists
    $check = $conn->prepare("SELECT user_id FROM users WHERE name = ?");
    $check->bind_param("s", $name);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {
        $response = [
            "status"  => "error",
            "message" => "User name already exist, Try adding a prifix or business name",
            "code"    => 409 // Conflict
        ];
        echo json_encode($response);
        exit;
    }
    $check->close();


    try {
        // Hash password
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        // Prepare SQL
        $stmt = $conn->prepare(
            "INSERT INTO users (name, email, phone, address, password, agent, agent_id) 
             VALUES (?, ?, ?, ?, ?, ?, ?)"
        );

        $stmt->bind_param("sssssss", $name, $email, $phone, $address, $hashed_password, $agent, $agent_id);

        if ($stmt->execute()) {
            $response = [
                "status"  => "success",
                "message" => "Successfully created account for $name",
                "code"    => 200
            ];

// Clean name
$nameClean = strtolower($name);
$nameClean = preg_replace('/\s+/', '', $nameClean);
$nameClean = preg_replace('/[^a-z0-9]/', '', $nameClean);

// Generate random string
function generateRandomString($length = 6) {
    return substr(strtoupper(bin2hex(random_bytes(4))), 0, $length);
}

// Create user_id
$user_id = $nameClean . '-' . generateRandomString(6);

// Update query
$updateId = $conn->prepare("UPDATE users
    SET user_id = ?
    WHERE name = ?
");

$updateId->bind_param("ss", $user_id, $name);
$updateId->execute();


                        // Save to User info
$update = $conn->prepare("INSERT INTO auth_users(username, user_id, user_type , password_hash) VALUES(?, ?, ?, ?)");

$update->bind_param("ssss", $name, $user_id, $target_tb, $hashed_password);
$update->execute();

            // notification Insert
            $stmtNotify = $conn->prepare("INSERT INTO notifications (actor_type, actor_id, action,	target_table,target_id, message) VALUES (?, ?, ?, ?, ?, ?)");
            $stmtNotify->bind_param('ssssss', $actor_type, $agent_id, $action_type, $target_tb, $user_id, $message);
            $stmtNotify->execute();

                        // Get user email

                $recipientEmail = $email; 
                if ($recipientEmail) {
                    $mail = new PHPMailer(true);
                    $subject = "Welcome to SavingHub 🎉 Your account is ready!";
                    $body = "
                    <p>&#128075; Dear $name,</p>
                    <p>&#9989; Your SavingHub account has been successfully created.</p>
                    <p>&#127881; Thank you for joining us!</p>
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
            
            // end of email insert

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

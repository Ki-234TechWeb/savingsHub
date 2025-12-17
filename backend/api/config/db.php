

<?php
$host = 'localhost';
$user = 'root';
$password = ''; // leave blank unless you set one
$dbname = 'savingshub';

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

?>

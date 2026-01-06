 <?php
  error_reporting(E_ALL);
  ini_set('display_errors', 1);
  header('Content-Type: application/json');
  include './../config/env.php';

  $type = $_GET['type'] ?? 'all';
  $users = [];
  $staff = [];
  $singleStaff = [];
  $userUpdate = [];
  $userPlans = [];
  $notifications = [];
  $collections = [];
  $todaysCollections = [];
  $monthlyCollection = [];
  $collectionsSummary = [];
  $todaysPendingCollections = [];
  $weeklyCollections = [];
  if ($type === "user") {
    $agent_id = 5;
    $sql = "SELECT 
    u.user_id,
    u.name,
    u.phone,
    u.agent_id,
    u.address,
    u.created_at,
    u.status,
    u.role
FROM users u
WHERE u.agent_id = ?;
";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
      die("Prepare failed: " . $conn->error);
    }

    $stmt->bind_param("i", $agent_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $users = [];

    while ($row = $result->fetch_assoc()) {
      $users[] = $row;
    }
  } elseif ($type === "singleUser") {
    // Get user_id from query string
    $user_id = $_GET['id'] ?? null;

    if ($user_id) {
      $sql = "SELECT 
        u.user_id,
        u.name,
        u.phone,
          u.email,
        u.agent_id,
        u.address,
        u.nextofkin
    FROM users u
    WHERE u.user_id = ?";

      $stmt = $conn->prepare($sql);
      if (!$stmt) {
        echo json_encode([
          "status" => "error",
          "message" => "Prepare failed: " . $conn->error
        ]);
        exit;
      }

      $stmt->bind_param("i", $user_id);
      $stmt->execute();
      $result = $stmt->get_result();
      $userUpdate = [];
      if ($row = $result->fetch_assoc()) {
        $userUpdate[] = $row;
      }
    }
  } elseif ($type === "userPlans") {
    $agent_id = 5;
    $sql = "SELECT `user_id`,`user_plan_id`,`agent_id`, `user_name`, `plan_type`,  `target_amount`,`duration_months`,  `contribution_per_cycle`,`collected`,`status`,`start_date` FROM `userplans` WHERE `agent_id` = ?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
      die("Prepare failed: " . $conn->error);
    }

    $stmt->bind_param("s", $agent_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $userPlans = [];

    while ($row = $result->fetch_assoc()) {
      $userPlans[] = $row;
    }
  } elseif ($type === "collections") {
    $sql = " SELECT 
    c.amount,
    c.date,
    c.plan_type,
    c.contribution_id,
    c.agent_id,
    u.name,
    u.user_id,
    u.status
FROM contributions c
JOIN users u ON c.user_id = u.user_id
WHERE c.agent_id = ? ";
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
      die("prepare failed" . $conn->error);
    }
    $agentId = 5;
    $stmt->bind_param("i", $agentId);
    $stmt->execute();
    $result = $stmt->get_result();
    $collections = [];
    while ($row = $result->fetch_assoc()) {
      $collections[] = $row;
    }
  } elseif ($type === "collectionsSummary") {
    $sql = "SELECT
                SUM(CASE WHEN DATE(c.date) = CURDATE() THEN c.amount ELSE 0 END) AS todays_total,
                SUM(CASE WHEN YEARWEEK(c.date, 1) = YEARWEEK(CURDATE(), 1) THEN c.amount ELSE 0 END) AS weekly_total,
                SUM(CASE WHEN YEAR(c.date) = YEAR(CURDATE()) AND MONTH(c.date) = MONTH(CURDATE()) THEN c.amount ELSE 0 END) AS monthly_total
            FROM contributions c
            WHERE c.agent_id = ?";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
      die("prepare failed: " . $conn->error);
    }
    $agentId = 5;
    $stmt->bind_param("i", $agentId);
    $stmt->execute();
    $result = $stmt->get_result();
    // contains todays_total, weekly_total, monthly_total
    $collectionsSummary = $result->fetch_assoc();
  } elseif ($type === "todaysPendingCollections") {
    $sql = "SELECT COUNT(*) AS pending_collections
            FROM users u
            WHERE u.agent = ?
              AND NOT EXISTS (
                SELECT 1 
                FROM contributions c
                WHERE c.user_id = u.user_id
                  AND DATE(c.date) = CURDATE()
              )";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
      die("prepare failed: " . $conn->error);
    }
    $agentId = "Agent John Okafor";
    $stmt->bind_param("s", $agentId);
    $stmt->execute();
    $result = $stmt->get_result();
    $todaysPendingCollections = $result->fetch_assoc();
    // $pendingCollections['pending_collections'] holds the number
  } elseif ($type === "todaysCollections") {
    $sql = " SELECT 
    c.amount,
    c.date,
    c.plan_type,
      c.contribution_id,
      c.agent_id,
    u.name,
    u.user_id,
    u.status
FROM contributions c
JOIN users u ON c.user_id = u.user_id
WHERE c.agent_id = ?
  AND DATE(c.date) = CURDATE();";
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
      die("prepare failed" . $conn->error);
    }
    $agentId = 5;
    $stmt->bind_param("i", $agentId);
    $stmt->execute();
    $result = $stmt->get_result();
    $todaysCollections = [];
    while ($row = $result->fetch_assoc()) {
      $todaysCollections[] = $row;
    }
  } elseif ($type === "weeklyCollections") {
    $sql = "SELECT 
    c.amount,
    c.date,
    c.plan_type,
      c.contribution_id,
      c.agent_id,
    u.name,
    u.user_id,
    u.status
FROM contributions c
JOIN users u ON c.user_id = u.user_id
WHERE c.agent_id = ?
  AND YEARWEEK(c.date, 1) = YEARWEEK(CURDATE(), 1);";
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
      die("prepare failed" . $conn->error);
    }
    $agentId = 5;
    $stmt->bind_param("i", $agentId);
    $stmt->execute();
    $result = $stmt->get_result();
    $weeklyCollections = [];
    while ($row = $result->fetch_assoc()) {
      $weeklyCollections[] = $row;
    }
  } elseif ($type === "monthly") {
    $sql = "SELECT 
    c.amount,
    c.date,
    c.plan_type,
      c.contribution_id,
      c.agent_id,
    u.name,
    u.user_id,
    u.status
FROM contributions c
JOIN users u ON c.user_id = u.user_id
WHERE c.agent_id = ?
  AND YEAR(c.date) = YEAR(CURDATE())
  AND MONTH(c.date) = MONTH(CURDATE());
";
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
      die("prepare failed" . $conn->error);
    }
    $agentId = 5;
    $stmt->bind_param("i", $agentId);
    $stmt->execute();
    $result = $stmt->get_result();
    $monthlyCollection = [];
    while ($row = $result->fetch_assoc()) {
      $monthlyCollection[] = $row;
    }
  } elseif ($type === "notifications") {
    $stmt = $conn->prepare("SELECT `message`, `created_at` 
FROM notifications 
WHERE actor_id = ? 
ORDER BY `created_at` DESC;
");
    $agent_id = 5;
    $stmt->bind_param("i", $agent_id);
    $stmt->execute();
    $notifications = [];
    $result = $stmt->get_result();
    while ($row = $result->fetch_assoc()) {
      $notifications[] = $row;
    }
  } elseif ($type === "staff") {
    $stmt = $conn->prepare("SELECT agent_id, name FROM agents");
    $stmt->execute();
    $staff = [];
    $result = $stmt->get_result();
    while ($row = $result->fetch_assoc()) {
      $staff[] = $row;
    }
  } elseif ($type === "singleStaff") {
    $stmt = $conn->prepare("SELECT agent_id, name, phone, email, created_at, password, address FROM agents WHERE agent_id =?");
    $agent_id = 5;
    $stmt->bind_param("i", $agent_id);
    $stmt->execute();
    $singleStaff = [];
    $result = $stmt->get_result();
    while ($row = $result->fetch_assoc()) {
      $singleStaff[] = $row;
    }
  }




  echo json_encode([
    "users" => $users,
    "collections" => $collections,
    "collectionsSummary" => $collectionsSummary,
    "staff" => $staff,
    "singleStaff" => $singleStaff,
    "userPlans" => $userPlans,
    "todaysCollections" => $todaysCollections,
    "weeklyCollections" => $weeklyCollections,
    "monthlyCollection" => $monthlyCollection,
    "todaysPendingCollections" => $todaysPendingCollections,
    "notifications" => $notifications,
    "userUpdate" => $userUpdate
  ]);

  ?>  

 <?php
  error_reporting(E_ALL);
  ini_set('display_errors', 1);
  header('Content-Type: application/json');
  include './../config/env.php';
    require_once "./../../middleware/auth.php";

  $type = $_GET['type'] ?? 'all';
  $cardData = [];
  $graphInfo =[];
  $getAgent = [];
  $userUpdate = [];
  $agentUpdate = [];
   $usersCounts = [];
    $agent = [];
     $users = [];
     $staff = [];
     $getPlans = [];
      $userPlans = []; 
      $collections = [];
  $todaysCollections = [];
  $monthlyCollection = [];
  $collectionsSummary = [];
  $weeklyCollections = [];
$notifications = [];

if ($LOGGED_IN_USER_TYPE !== 'admin') {
    http_response_code(403);
    echo json_encode(["error" => "Admins only"]);

    exit;
}
else{


 if ($type==="cardD") {
// Prepare and execute query
$sql = $conn->prepare("
    SELECT 
        DATE_FORMAT(CURDATE(), '%Y-%m') AS month,
        d.total_deposits,
        d.total_income,
        a.total_saving_accounts
    FROM (
      
        SELECT 
            SUM(amount) AS total_deposits,
            SUM(Commision) AS total_income
        FROM (
            SELECT 
                c.user_plan_id,
                SUM(c.amount) AS amount,
                p.Commision
            FROM contributions c
            JOIN userplans p ON c.user_plan_id = p.user_plan_id
            WHERE YEAR(c.date) = YEAR(CURDATE())
              AND MONTH(c.date) = MONTH(CURDATE())
            GROUP BY c.user_plan_id, p.Commision
        ) AS plan_income
    ) d
    JOIN (
        
        SELECT COUNT(user_plan_id) AS total_saving_accounts
        FROM userplans
        WHERE YEAR(start_date) = YEAR(CURDATE())
          AND MONTH(start_date) = MONTH(CURDATE())
    ) a
");

$sql->execute();
$result = $sql->get_result();
$row = $result->fetch_assoc();
$cardData[] = $row;

  }elseif ($type==="graph") {
    $stmt = $conn->prepare ("SELECT * FROM (
    SELECT 
        month,
        SUM(total_deposits) AS total_deposits,
        SUM(total_income) AS total_income
    FROM (
        SELECT 
            DATE_FORMAT(c.date, '%Y-%m') AS month,
            SUM(c.amount) AS total_deposits,
            p.Commision AS total_income
        FROM contributions c
        JOIN userplans p ON c.user_plan_id = p.user_plan_id
        GROUP BY month, c.user_plan_id, p.Commision
    ) AS monthly_plan_income
    GROUP BY month
    ORDER BY month DESC
    LIMIT 6
) AS last6 ORDER BY month ASC; ");
    $stmt->execute();
    $graphInfo = [];
    $result = $stmt->get_result();
    while ($row = $result->fetch_assoc()) {
      $graphInfo[] = $row;
    }


  }elseif ($type === "usersCounts") {
    $sql = "SELECT COUNT(*) AS total_users, SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS active_users, SUM(CASE WHEN YEAR(created_at) = YEAR(CURDATE()) AND MONTH(created_at) = MONTH(CURDATE()) THEN 1 ELSE 0 END) AS users_this_month FROM users;
";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
      die("Prepare failed: " . $conn->error);
    }

    $stmt->execute();
    $result = $stmt->get_result();
    $usersCounts = [];

    while ($row = $result->fetch_assoc()) {
      $usersCounts[] = $row;
    }
  }elseif ($type==="user") {
    $sql = "SELECT 
    u.user_id,
    u.name,
    u.phone,
    u.agent,
    u.agent_id,
    u.address,
    u.created_at,
    u.status,
    u.role
FROM users u;
";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
      die("Prepare failed: " . $conn->error);
    }
    $stmt->execute();
    $result = $stmt->get_result();
    $users = [];

    while ($row = $result->fetch_assoc()) {
      $users[] = $row;
    }



  }elseif ($type === "staff") {
    $stmt = $conn->prepare("SELECT agent_id, name FROM agents");
    $stmt->execute();
    $staff = [];
    $result = $stmt->get_result();
    while ($row = $result->fetch_assoc()) {
      $staff[] = $row;
    }
  }elseif ($type === "agent") {
    $stmt = $conn->prepare("SELECT a.*, COUNT(u.agent_id) AS total_users FROM agents a LEFT JOIN users u ON a.agent_id = u.agent_id GROUP BY a.agent_id;");
    $stmt->execute();
    $agent = [];
    $result = $stmt->get_result();
    while ($row = $result->fetch_assoc()) {
      $agent[] = $row;
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

      $stmt->bind_param("s", $user_id);
      $stmt->execute();
      $result = $stmt->get_result();
      $userUpdate = [];
      if ($row = $result->fetch_assoc()) {
        $userUpdate[] = $row;
      }
    }
  }elseif ($type === "singleAgent") {
    // Get user_id from query string
    $agent_id = $_GET['id'] ?? null;

    if ($agent_id) {
      $sql = "SELECT 
        u.agent_id,
        u.name,
        u.phone,
          u.email,
        u.address
    FROM agents u
    WHERE u.agent_id = ?";

      $stmt = $conn->prepare($sql);
      if (!$stmt) {
        echo json_encode([
          "status" => "error",
          "message" => "Prepare failed: " . $conn->error
        ]);
        exit;
      }

      $stmt->bind_param("s", $agent_id);
      $stmt->execute();
      $result = $stmt->get_result();
      $agentUpdate = [];
      if ($row = $result->fetch_assoc()) {
        $agentUpdate[] = $row;
      }
    }
  }
  elseif ($type === "userPlans") {
    $agId = $_GET['id'] ?? null;
    $sql = "SELECT `user_id`,`user_plan_id`,`agent_id`, `user_name`, `plan_type`,  `target_amount`,`duration_months`,  `contribution_per_cycle`,`collected`,`status`,`start_date` FROM `userplans` WHERE `agent_id` = ?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
      die("Prepare failed: " . $conn->error);
    }

    $stmt->bind_param("s", $agId);
    $stmt->execute();
    $result = $stmt->get_result();
    $userPlans = [];

    while ($row = $result->fetch_assoc()) {
      $userPlans[] = $row;
    }
  } elseif ($type === "getPlans") {
   
    $sql = "SELECT
    up.user_plan_id,
    up.user_id,
    up.user_name,
    up.agent_id,
    up.plan_type,
    up.Commision,
    up.target_amount,
    up.duration_months,
    up.contribution_per_cycle,
    up.collected,
    up.status,
    up.start_date,

    COUNT(DISTINCT cycle_no) AS commission_cycles,
    up.Commision * COUNT(DISTINCT cycle_no) AS real_time_commission

FROM userplans up

LEFT JOIN (
    SELECT
        c.user_plan_id,
        TIMESTAMPDIFF(
            MONTH,
            up.start_date,
            c.date
        ) AS cycle_no
    FROM contributions c
    JOIN userplans up
      ON up.user_plan_id = c.user_plan_id
) cycles
  ON cycles.user_plan_id = up.user_plan_id
  AND cycle_no >= 0

WHERE
    up.withdrawn_at IS NULL
    AND up.status IN ('in progress', 'completed')
     AND ( ? IS NULL OR up.agent_id = ? )
GROUP BY up.user_plan_id
";
 $agentId = $_GET['agent_id'] ?? null;
    $stmt = $conn->prepare($sql);
    if ($agentId) {
    $stmt->bind_param("ii", $agentId, $agentId);
} else {
    $null = null;
    $stmt->bind_param("ii", $null, $null);
}
    $stmt->execute();
    $result = $stmt->get_result();
    $getPlans = [];

    while ($row = $result->fetch_assoc()) {
      $getPlans[] = $row;
    }
  }
  elseif ($type === "getAgent") {
      $user_id = $_GET['id'] ?? null;

    if ($user_id) {
      $sql = "SELECT 
        u.agent_id,
        u.agent,
        u.name,
        u.user_id
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

      $stmt->bind_param("s", $user_id);
      $stmt->execute();
      $result = $stmt->get_result();
     $getAgent = [];
      if ($row = $result->fetch_assoc()) {
       $getAgent[] = $row;
      }
    }  

  }elseif ($type === "collections") {

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
  WHERE ( ? IS NULL OR c.agent_id = ? )";

  $stmt = $conn->prepare($sql);
  if (!$stmt) die('prepare failed ' . $conn->error);
$agentId = $_GET['agent_id'] ?? null;
if ($agentId === '') {
    $agentId = null;
}
  $stmt->bind_param("ss", $agentId, $agentId);
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
      SUM(CASE WHEN YEAR(c.date) = YEAR(CURDATE()) 
               AND MONTH(c.date) = MONTH(CURDATE()) THEN c.amount ELSE 0 END) AS monthly_total
  FROM contributions c
  WHERE ( ? IS NULL OR c.agent_id = ? )";

  $stmt = $conn->prepare($sql);
  if (!$stmt) die('prepare failed ' . $conn->error);
$agentId = $_GET['agent_id'] ?? null;
if ($agentId === '') {
    $agentId = null;
}
  $stmt->bind_param("ss", $agentId, $agentId);
  $stmt->execute();

  $result = $stmt->get_result();
  $collectionsSummary = $result->fetch_assoc();

} elseif ($type === "todaysCollections") {

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
  WHERE DATE(c.date) = CURDATE()
    AND ( ? IS NULL OR c.agent_id = ? )";

  $stmt = $conn->prepare($sql);
  if (!$stmt) die('prepare failed ' . $conn->error);
$agentId = $_GET['agent_id'] ?? null;
if ($agentId === '') {
    $agentId = null;
}
  $stmt->bind_param("ss", $agentId, $agentId);
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
  WHERE YEARWEEK(c.date, 1) = YEARWEEK(CURDATE(), 1)
    AND ( ? IS NULL OR c.agent_id = ? )";

  $stmt = $conn->prepare($sql);
  if (!$stmt) die('prepare failed ' . $conn->error);
$agentId = $_GET['agent_id'] ?? null;
if ($agentId === '') {
    $agentId = null;
}
  $stmt->bind_param("ss", $agentId, $agentId);
  $stmt->execute();

  $result = $stmt->get_result();
  $weeklyCollections = [];
  while ($row = $result->fetch_assoc()) {
    $weeklyCollections[] = $row;
  }

}elseif ($type === "notifications") {
    $stmt = $conn->prepare("SELECT `message`, `created_at` 
FROM notifications  
ORDER BY `created_at` DESC;
");
    $stmt->execute();
    $notifications = [];
    $result = $stmt->get_result();
    while ($row = $result->fetch_assoc()) {
      $notifications[] = $row;
    }
  }elseif ($type === "monthly") {

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
  WHERE YEAR(c.date) = YEAR(CURDATE())
    AND MONTH(c.date) = MONTH(CURDATE())
    AND ( ? IS NULL OR c.agent_id = ? )";

  $stmt = $conn->prepare($sql);
  if (!$stmt) die('prepare failed ' . $conn->error);
$agentId = $_GET['agent_id'] ?? null;
if ($agentId === '') {
    $agentId = null;
}
  $stmt->bind_param("ss", $agentId, $agentId);
  $stmt->execute();

  $result = $stmt->get_result();
  $monthlyCollection = [];
  while ($row = $result->fetch_assoc()) {
    $monthlyCollection[] = $row;
  }
}

}

  


echo json_encode([
    "cardData" => $cardData,
    "graphInfo" => $graphInfo,
     "usersCounts" => $usersCounts,
     "users" =>   $users,
     "staff" => $staff,
     "userAgent" => $getAgent,
     "userUpdate" => $userUpdate ,
     "agentUpdate"=> $agentUpdate ,
     "agent" => $agent,
      "userPlans" => $userPlans,
      "getPlans" => $getPlans,
       "todaysCollections" => $todaysCollections,
    "weeklyCollections" => $weeklyCollections,
    "monthlyCollection" => $monthlyCollection,
    "collections" => $collections,
    "collectionsSummary" => $collectionsSummary,
    "notifications" => $notifications,
  ]);
























  ?>
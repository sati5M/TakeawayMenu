<?php


require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/Application.php';
require __DIR__ . '/Validator.php';
require __DIR__ . '/User.php';
require __DIR__ . '/ToppingsFormatter.php';
require __DIR__ . '/FoodFormatter.php';
require __DIR__ . '/OrderFormatter.php';

error_reporting(E_ALL ^ E_DEPRECATED);
header("Access-Control-Allow-Origin: http://127.0.0.1:5173");
header('Access-Control-Allow-Credentials: true');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST');
header("Cache-Control: no-store, no-cache");

$database = new \Dibi\Connection([
    'driver'   => 'mysqli',
    'host'     => 'localhost',
    'username' => 'root',
//    'password' => '',
    'database' => 'yummies',
]);


session_start();

$method = $_SERVER['REQUEST_METHOD'];

$validator = new Validator();
$toppingsFormatter = new ToppingsFormatter();
$foodFormatter = new FoodFormatter();
$orderFormatter = new OrderFormatter();
$loggedInUser = null;

if(isset($_SESSION['user_id']) && $_SESSION['user_id']) {
    $users = $database->query('SELECT * FROM users WHERE id=?', $_SESSION['user_id'])->fetchAll();

    if(count($users) === 1) {
        $dbUser = $users[0];
        $loggedInUser = new User(
            $dbUser->id,
            $dbUser->first_name,
            $dbUser->last_name,
            $dbUser->email,
            $dbUser->address,
            $dbUser->phone,
            $dbUser->is_admin ? true : false,
            new DateTime($dbUser->created_at),
            new DateTime($dbUser->updated_at)
        );


    }
}


$application = new Application(
    $method,
    $database,
    $validator,
    $loggedInUser,
    $toppingsFormatter,
    $foodFormatter,
    $orderFormatter

);

if($application->isOptions()) {
    exit;
}

return $application;
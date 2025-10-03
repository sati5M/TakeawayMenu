<?php

/** @var Application $app */
$app = require __DIR__ . '/../lib/bootstrap.php';
require __DIR__ . '/../lib/Basket.php';

if(!$app->isPost()) {

    $app->sendJson([
        'status' => 'error',
        'description' => 'Unsupported method'
    ], 405);
    return;
}

if(!$app->isLoggedIn()) {
    $app->sendJson([
        'status' => 'fail',
        "errors" => [
            "notloggedin" => "You are not logged in."
        ]
    ], 401);
    return;
}

if(!$app->getUser()->isAdmin()) {
    $app->sendJson([
        'status' => 'fail',
        "errors" => [
            "notloggedin" => "You are unauthorized."
        ]
    ], 403);
    return;
}

$contents = $app->getPostContents();
$errors = $app->getValidator()->validate($contents, [
    'orderId' => [Validator::REQUIRED, Validator::INTEGER],
]);

if (count($errors) != 0) {
    $app->sendJson([
        'status' => 'fail',
        'errors' => $errors
    ], 422);
    return;
}

$data = $app->getDatabase()->query('SELECT status FROM orders WHERE order_id = ?', $contents['orderId'])->fetchSingle();

$newStatus = "Ontheway";
if ($data == "Ontheway") {
    $newStatus = "Delivered";
}


$app->getDatabase()->query('UPDATE orders SET status = ? WHERE order_id = ?', $newStatus, $contents['orderId']);

$data = $app->getOrderUtil()->formatOrders($app->getDatabase());

$app->sendJson([
    'status' => 'ok',
    'orders' => $data
], 200);
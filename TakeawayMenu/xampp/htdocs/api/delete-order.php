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
if ($data != "Delivered") {
    $app->sendJson([
        'status' => 'fail',
        "errors" => [
            "notdelivered" => "You can not delete an undelivered order."
        ]
    ], 403);
    return;
}

$orderItems = $app->getDatabase()->query("SELECT order_item_id FROM order_item WHERE order_id = ?",  $contents['orderId'])->fetchAll();
foreach ($orderItems as $item) {
    $app->getDatabase()->query('DELETE FROM order_item_topping WHERE order_item_id = ?', $item['order_item_id']);
}

$app->getDatabase()->query('DELETE FROM order_item WHERE order_id = ?', $contents['orderId']);

$app->getDatabase()->query('DELETE FROM orders WHERE order_id = ?', $contents['orderId']);

$data = $app->getOrderUtil()->formatOrders($app->getDatabase());

$app->sendJson([
    'status' => 'ok',
    'orders' => $data
], 200);
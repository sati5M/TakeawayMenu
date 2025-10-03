<?php

/** @var Application $app */
$app = require __DIR__ . '/../lib/bootstrap.php';
require __DIR__ . '/../lib/Basket.php';

if(!$app->isGet()) {

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

$data = $app->getOrderUtil()->formatOrders($app->getDatabase());

$app->sendJson([
    'status' => 'ok',
    'orders' => $data
], 200);
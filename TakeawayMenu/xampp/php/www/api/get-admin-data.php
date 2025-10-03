<?php

/** @var Application $app */
$app = require __DIR__ . '/../lib/bootstrap.php';

if($app->isPost()) {
    $app->sendJson([
        'status' => 'error',
        'description' => 'Unsupported method'
    ], 405);
    return;
}


$outOfStockItems = $app->getDatabase()->query('SELECT * from food_items WHERE is_available = 0');
//$outOfStockItems = $app->getDatabase()->query('SELECT * from food_items WHERE is_available = 0');
$ordersThisMonth = $app->getDatabase()->query('SELECT * FROM orders WHERE order_date > ?', new DateTime('-1 month'));
$ordersThisWeek = $app->getDatabase()->query('SELECT * FROM orders WHERE order_date > ?', new DateTime('-1 week'));

$amountThisMonth = 0.0;
$amountThisWeek = 0.0;
foreach($ordersThisMonth as $orderData) {
    $amountThisMonth += $orderData->total_amount;
}

foreach($ordersThisWeek as $orderData) {
    $amountThisWeek += $orderData->total_amount;
}

$adminData = [
    "outOfStockItems" => count($outOfStockItems),
    "amountThisWeek" => $amountThisWeek,
    "amountThisMonth" => $amountThisMonth,
];


$app->sendJson($adminData);

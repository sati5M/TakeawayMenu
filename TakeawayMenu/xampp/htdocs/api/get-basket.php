<?php

/** @var Application $app */
$app = require __DIR__ . '/../lib/bootstrap.php';
require __DIR__ . '/../lib/Basket.php';

if($app->isPost()) {

    $app->sendJson([
        'status' => 'error',
        'description' => 'Unsupported method'
    ], 405);
    return;
}

if(!$app->isLoggedIn()) {
    $app->sendJson([
        'status' => 'error',
        'description' => 'Unauthorized'
    ], 401);
    return;
}

$user = $app->getUser();
$userId = $user->getId();
$basketsWithUserId = $app->getDatabase()->query('SELECT * from basket WHERE user_id = ?', $userId);
$basketId = null;
if (count($basketsWithUserId) === 0) {
    $app->sendJson([
        'status' => 'ok',
        'basket' => [],
    ], 200);
    return;
}


$basketId = $basketsWithUserId->fetchAll()[0]->basket_id;
$basket = new Basket($basketId, $userId, $app->getDatabase(), $app->getToppingsUtil());

 $app->sendJson([
    'status' => 'ok',
    'basket' => $basket->getUserBasket(),
], 200);
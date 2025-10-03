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
        'status' => 'error',
        'description' => 'Unauthorized'
    ], 401);
    return;
}

$contents = $app->getPostContents();

$errors = $app->getValidator()->validate($contents, [
    'item_id' => [Validator::REQUIRED],
]);

if (count($errors) != 0) {
    $app->sendJson([
        'status' => 'fail',
        'errors' => $errors
    ], 422);
    return;
}


$user = $app->getUser();
$userId = $user->getId();
$basketsWithUserId = $app->getDatabase()->query('SELECT * from basket WHERE user_id = ?', $userId);
$basketId = null;
if (count($basketsWithUserId) === 0) {
    $insertData = [
        'user_id' => $userId,
    ];

    $app->getDatabase()->query('INSERT INTO basket', $insertData);
    $basketId = $app->getDatabase()->getInsertId();
} else {
    $basketId = $basketsWithUserId->fetchAll()[0]->basket_id;
}
$basket = new Basket($basketId, $userId, $app->getDatabase(), $app->getToppingsUtil());

$basket->addItemToBasket($contents["item_id"], $contents["toppings"]);



 $app->sendJson([
    'status' => 'ok',
    'basket' => $basket->getUserBasket(),
], 200);
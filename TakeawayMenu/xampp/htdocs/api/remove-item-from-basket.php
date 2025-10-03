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

$contents = $app->getPostContents();

$errors = $app->getValidator()->validate($contents, [
    'basket_item_id' => [Validator::REQUIRED, Validator::INTEGER],
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
$basketItem = $app->getDatabase()->query('SELECT * from basket_item WHERE basket_item_id = ?', $contents['basket_item_id']);
if (count($basketItem) <= 0) {
    return;
}

$basketId = $basketItem->fetchAll()[0]->basket_id;
$basketIdData = $app->getDatabase()->query('SELECT user_id from basket WHERE basket_id = ?', $basketId);
if ($basketIdData->fetchAll()[0]->user_id != $userId) {
    return;
}

$basket = new Basket($basketId, $userId, $app->getDatabase(), $app->getToppingsUtil());
$basket->removeItemFromBasket($contents['basket_item_id']);

 $app->sendJson([
    'status' => 'ok',
    'basket' => $basket->getUserBasket(),
], 200);
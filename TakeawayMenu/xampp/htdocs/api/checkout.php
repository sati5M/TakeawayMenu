<?php

require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/../lib/Basket.php';

/** @var Application $app */
$app = require __DIR__ . '/../lib/bootstrap.php';

if (!$app->isPost()) {
    $app->sendJson([
        'status' => 'error',
        'description' => 'Unsupported method'
    ], 405);
    return;
}


if (!$app->isLoggedIn()) {
    $app->sendJson([
        'status' => 'error',
        'description' => 'Unauthorized'
    ], 401);
    return;
}

$contents = $app->getPostContents();
$errors = $app->getValidator()->validate($contents, [
    'postcode' => [Validator::REQUIRED, Validator::STRING, Validator::MAX_7_LETTERS, Validator::MIN_5_LETTERS],
    'address' => [Validator::REQUIRED, Validator::STRING],
    'number' => [Validator::REQUIRED, Validator::PHONE_NUMBER],
]);

if (count($errors) != 0) {
    $app->sendJson([
        'status' => 'error',
        'errors' => $errors
    ], 401);
    return;
}


use Stripe\Stripe;

Stripe::setApiKey("sk_test_51PD4xIJhJMUNCOjAPA1pRUwTD1O8kKOvxbStd1G7Tml9vOEaegyg8uTYnllnmgyw9k8tEDlFp0mS8nnrNsxKbtEu00FaUNoY4M");
$user = $app->getUser();
$userId = $user->getId();
$basketId = $app->getUser()->getBasketId($app);
if ($basketId === 0) {
    return;
}

$basket = new Basket($basketId, $userId, $app->getDatabase(), $app->getToppingsUtil());

$formattedLineItems = $app->getFoodUtil()->formatForStripe($app->getDatabase(), $basket->getUserBasket());

if (count($formattedLineItems) === 0) {
    // $app->sendJson([
    //     'status' => 'error',
    //     'errors' => [
    //         "basket" => "Your basket is empty."
    //     ]
    // ], 401);
    return;
}


$checkoutSession = \Stripe\Checkout\Session::create([
    "mode" => "payment",
    "success_url" => "http://127.0.0.1/api/success.php?provider_session_id={CHECKOUT_SESSION_ID}",
    "line_items" => $formattedLineItems,
    "metadata" => [
        'user_id' => $userId,
        'basket_id' => $basketId,
        'postcode' => $contents['postcode'],
        'address' => $contents['address'],
        'number' => $contents['number'],
    ]
]);

$app->sendJson(
    [
        'status' => 'ok',
        'url' => $checkoutSession->url,
    ]
,200);
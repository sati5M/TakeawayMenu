<?php

require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/../lib/Basket.php';

/** @var Application $app */
$app = require __DIR__ . '/../lib/bootstrap.php';



$stripe = new \Stripe\StripeClient('STRIPE_KEY');
$sessionData = $stripe->checkout->sessions->retrieve($_GET['provider_session_id'], []);

if ($sessionData->payment_status === 'paid') {
    $user = $app->getUser();
    $userId = $user->getId();
    $basketId = $user->getBasketId($app);
    $basket = new Basket($basketId, $userId, $app->getDatabase(), $app->getToppingsUtil());
    $basket->setBasketAsOrdered($sessionData);
    header("Location: http://127.0.0.1:5173/success");
} else {
    header("Location: http://127.0.0.1:5173/fail");
}


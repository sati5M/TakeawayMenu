<?php

/** @var Application $app */
$app = require __DIR__ . '/../lib/bootstrap.php';
if($app->isLoggedIn()) {
    $user = $app->getUser();

    $app->sendJson([
        'id' => $user->getId(),
        'firstName' => $user->getFirstName(),
        'lastName' => $user->getLastName(),
        'email' => $user->getEmail(),
        'isAdmin' => $user->isAdmin(),
        'phone' => $user->getPhone(),
        'address' => $user->getAddress(),
    ], 200);
} else {
    $app->sendJson([
        'status' => 'fail',
    ], 401);
}
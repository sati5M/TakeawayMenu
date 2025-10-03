<?php

/** @var Application $app */
$app = require __DIR__ . '/../lib/bootstrap.php';

if(!$app->isPost()) {

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
    'email' => [Validator::REQUIRED, Validator::STRING, Validator::EMAIL],
    'firstname' => [Validator::REQUIRED, Validator::STRING],
    'surname' => [Validator::REQUIRED,  Validator::STRING],
    'address' => [Validator::REQUIRED,  Validator::STRING],
    'number' => [Validator::REQUIRED, Validator::PHONE_NUMBER],
]);

if(count($errors) != 0) {
    $app->sendJson([
        'status' => 'fail',
        'errors' => $errors
    ], 422);
    return;
}

$email = $contents['email'];
$firstname = $contents['firstname'];
$surname = $contents['surname'];
$address = $contents['address'];
$number = $contents['number'];
$password = $contents['password'];
if ($password != null && strlen($password) < 8) {
    $app->sendJson([
        'status' => 'fail',
        'errors' => [
            "password" => 'Password must be at least 8 letters'
        ]
    ], 422);
    return;
}


$users = $app->getDatabase()->query('SELECT * from users WHERE email = ?', $email)->fetchAll();
if(count($users) > 0 && $users[0]->id != $app->getUser()->getId()) {

    $app->sendJson([
        'status' => 'fail',
        'errors' => [
            "email" => 'User with that email already exists.'
        ]
    ], 422);
    return;
}


$insertData = [
    'first_name' => $firstname,
    'last_name' => $surname,
    'email' => $email,
    'address' => $address,
    'phone' => $number,
];



if (!$password != null) {
    $passwordHash = hash('sha256', $password);
    $insertData['password'] = $passwordHash;
}

$userid = $app->getUser()->getId();
$app->getDatabase()->query('UPDATE users SET', $insertData, 'WHERE id = ?', $userid);


$_SESSION['user_id'] = $userid;
$app->sendJson([
    'status' => 'ok',
    'user' => [
        'id' => $userid,
        'firstName' => $firstname,
        'lastName' => $surname,
        'email' => $email,
        'isAdmin' => $app->getUser()->isAdmin(),
        'phone' => $number,
        'address' => $address,
    ]
], 200);
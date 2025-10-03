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


$contents = $app->getPostContents();

$errors = $app->getValidator()->validate($contents, [
    'email' => [Validator::REQUIRED, Validator::STRING, Validator::EMAIL],
    'firstname' => [Validator::REQUIRED, Validator::STRING],
    'surname' => [Validator::REQUIRED, Validator::STRING],
    'address' => [Validator::REQUIRED, Validator::STRING],
    'number' => [Validator::REQUIRED, Validator::PHONE_NUMBER],
    'password' => [Validator::REQUIRED, Validator::STRING, Validator::MIN_8_LETTERS],
]);

if(count($errors) != 0) {
    $app->sendJson([
        'status' => 'fail',
        'errors' => $errors
    ], 422);
    return;
}

$password = $contents['password'];
if (strlen($password) < 8) {
    $app->sendJson([
        'status' => 'fail',
        'errors' => [
            "password" => "Password must contain 8 characters."
        ]
    ], 422);
    return;
}

$email = $contents['email'];
$users = $app->getDatabase()->query('SELECT * from users WHERE email = ?', $email)->fetchAll();
if(count($users) > 0) {
    $app->sendJson([
        'status' => 'fail',
        'errors' => [
            "email" => "User with that email already exists."
        ]
    ], 422);
    return;
}

$firstname = $contents['firstname'];
$surname = $contents['surname'];
$address = $contents['address'];
$number = $contents['number'];
$passwordHash = hash('sha256', $password);


$insertData = [
    'first_name' => $firstname,
    'last_name' => $surname,
    'email' => $email,
    'password' => $passwordHash,
    'address' => $address,
    'phone' => $number,
    'is_admin' => 0,
];

$app->getDatabase()->query('INSERT INTO users', $insertData);
$userid = $app->getDatabase()->getInsertId();

$_SESSION['user_id'] = $userid;
$app->sendJson([
    'status' => 'ok',
    'user' => [
        'id' => $userid,
        'firstName' => $firstname,
        'lastName' => $surname,
        'email' => $email,
        'isAdmin' => 0,
        'phone' => $number,
        'address' => $address,
    ]
], 200);
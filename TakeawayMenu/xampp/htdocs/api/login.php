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
    'password' => [Validator::REQUIRED, Validator::STRING, Validator::MIN_8_LETTERS]
]);

if(count($errors) != 0) {
    $app->sendJson([
        'status' => 'fail',
        'errors' => $errors
    ], 422);
    return;
}

$email = $contents['email'];
$password = $contents['password'];
$passwordHash = hash('sha256', $password);

$users = $app->getDatabase()->query('SELECT * from users WHERE email = ?', $email)->fetchAll();

if(count($users) != 1) {

    $app->sendJson([
        'status' => 'fail',
        "errors" => [
            "email" => "Email not found"
        ]
    ], 422);
    return;
}

$user = $users[0];

$userPasswordHash = $user->password;

if($userPasswordHash != $passwordHash) {
    $app->sendJson([
        'status' => 'fail',
        "errors" => [
            "password" => "Invalid password"
        ]
    ], 422);
    return;
}


$_SESSION['user_id'] = $user->id;
$app->sendJson([
    'status' => 'success',
    'user' => [
        'id' => $user->id,
        'firstName' => $user->first_name,
        'lastName' => $user->last_name,
        'email' => $user->email,
        'isAdmin' => $user->is_admin,
        'phone' => $user->phone,
        'address' => $user->address,
    ]
]);
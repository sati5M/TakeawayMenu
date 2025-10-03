<?php

/** @var Application $app */
$app = require __DIR__ . '/../lib/bootstrap.php';

if (isset($_SESSION['user_id'])) {
    session_unset();
    session_destroy();
    $app->sendJson([
        'status' => 'ok',
        'description' => 'Logged out'
    ], 200);
}

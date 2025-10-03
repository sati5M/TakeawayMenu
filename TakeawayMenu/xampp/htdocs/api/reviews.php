<?php

/** @var Application $app */
$app = require __DIR__ . '/../lib/bootstrap.php';
if(!$app->isLoggedIn()) {
    $app->sendJson([
        'status' => 'fail',
    ], 401);
    return;
}

function getReviews($app) {
    $reviews = $app->getDatabase()->query('SELECT * from review');
    $reviews = $reviews->fetchAll();
    return $reviews;
}


if ($app->isGet()) {

    $app->sendJson([
        'status' => 'ok',
        'reviews' => getReviews($app)
    ], 200);

} elseif ($app->isPost()) {
    $contents = $app->getPostContents();

    $errors = $app->getValidator()->validate($contents, [
        'name' => [Validator::REQUIRED, Validator::STRING],
        'starCount' => [Validator::INTEGER, Validator::MAX_5, VALIDATOR::MIN_1],
    ]);

    if (count($errors) > 0) {
        $app->sendJson([
            'status' => 'error',
            'errors' => $errors
        ], 400);
        return;
    }

    $user = $app->getUser();
    $userId = $user->getId();
    $app->getDatabase()->query('INSERT INTO review',
    [
        'name' => $contents['name'],
        'starCount' => $contents['starCount'],
    ]);


    $app->sendJson([
        'status' => 'ok',
        'reviews' => getReviews($app)
    ], 200);
}
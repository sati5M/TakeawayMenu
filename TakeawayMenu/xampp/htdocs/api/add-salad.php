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

if($app->isLoggedIn() && $app->getUser()->isAdmin()) {
    $contents = $app->getPostContents();

    $errors = $app->getValidator()->validate($contents, [
        'saladName' => [Validator::REQUIRED, Validator::STRING],
    ]);

    if (count($errors) === 0) {
        $saladName = $contents['saladName'];


        $insertData = [
            'name' => $saladName,
        ];

        $app->getDatabase()->query('INSERT INTO salad_sauce_option ', $insertData);
        $items = $app->getFoodUtil()->formatFood($app->getDatabase());
        $salads = $app->getFoodUtil()->formatSalads($app->getDatabase());
        $app->sendJson([
            'status' => 'ok',
            'items' => $items,
            'salads' => $salads
        ], 200);
    } else {
        $app->sendJson([
            'status' => 'fail',
            'errors' => $errors
        ], 422);
    }
} else {
    $app->sendJson([
        'status' => 'fail'
    ], 401);
}

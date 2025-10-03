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
        'categoryId' => [Validator::REQUIRED, Validator::INTEGER],
        'saladId' => [Validator::REQUIRED, Validator::INTEGER],
    ]);

    if (count($errors) === 0) {
        $categoryId = $contents['categoryId'];
        $saladId = $contents['saladId'];


        $insertData = [
            'category_id' => $categoryId,
            'salad_sauce_id' => $saladId,
        ];

        $app->getDatabase()->query('INSERT INTO food_sauce_salad ', $insertData);
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

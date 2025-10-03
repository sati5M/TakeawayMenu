<?php

/** @var Application $app */
$app = require __DIR__ . '/../lib/bootstrap.php';

if($app->isGet()) {


    $items = $app->getFoodUtil()->formatFood($app->getDatabase());
    $salads = $app->getFoodUtil()->formatSalads($app->getDatabase());
    $app->sendJson([
        'status' => 'ok',
        'items' => $items,
        'salads' => $salads
    ], 200);
} else if($app->isPost()) {
    if($app->isLoggedIn() && $app->getUser()->isAdmin()) {
        $contents = $app->getPostContents();

        $errors = $app->getValidator()->validate($contents, [
            'name' => [Validator::REQUIRED,  Validator::STRING],
            'description' => [Validator::REQUIRED,  Validator::STRING],
            'price' => [Validator::REQUIRED, Validator::FLOAT],
            'is_available' => [Validator::REQUIRED, Validator::REQUIRED_BOOL],
            'category_id' => [Validator::REQUIRED, Validator::INTEGER],
        ]);

        if (count($errors) === 0) {
            $name = $contents['name'];
            $description = $contents['description'];
            $price = $contents['price'];
            $isAvailable = $contents['is_available'];
            $categoryId = $contents['category_id'];

            $insertData = [
                'name' => $name,
                'description' => $description,
                'category_id' => $categoryId,
                'price' => $price,
                'is_available' => $isAvailable ? 1 : 0,
            ];



            $app->getDatabase()->query('INSERT INTO food_items', $insertData);
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
}
<?php

/** @var Application $app */
$app = require __DIR__ . '/../lib/bootstrap.php';

if($app->isGet()) {
    $categorys = $app->getDatabase()->query('SELECT * from category');

    $items = [];

    foreach($categorys as $category) {
        $items[] = [
            'id' => $category->category_id,
            'name' => $category->category_name,
            'description' => $category->category_description,
        ];
    }

    $app->sendJson($items);
} else if($app->isPost()) {
    if($app->isLoggedIn() && $app->getUser()->isAdmin()) {
        $contents = $app->getPostContents();

        $errors = $app->getValidator()->validate($contents, [
            'categoryName' => [Validator::REQUIRED, Validator::STRING],
            'categoryDesc' => [Validator::REQUIRED, Validator::STRING],
        ]);

        if (count($errors) === 0) {
            $category_name = $contents['categoryName'];
            $category_description = $contents['categoryDesc'];

            $insertData = [
                'category_name' => $category_name,
                'category_description' => $category_description,
            ];

            $app->getDatabase()->query('INSERT INTO category', $insertData);

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
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
            'name' => [Validator::REQUIRED],
            'description' => [Validator::REQUIRED],
            'category_id' => [Validator::REQUIRED],
        ]);

        if (count($errors) === 0) {
            $category_name = $contents['name'];
            $category_description = $contents['description'];
            $category_id = $contents['category_id'];

            $insertData = [
                'category_id' => $category_id,
                'category_name' => $category_name,
                'category_description' => $category_description,
            ];

            $app->getDatabase()->query('INSERT INTO category', $insertData);
            $app->sendJson(['status' => 'ok']);
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
<?php

/** @var Application $app */
$app = require __DIR__ . '/../lib/bootstrap.php';

if(!$app->isPost()) {
    $app->sendJson([
        'status' => 'fail'
    ], 401);
    return;
}



if($app->isLoggedIn() && $app->getUser()->isAdmin()) {
    $contents = $app->getPostContents();

    $errors = $app->getValidator()->validate($contents, [
        'name' => [Validator::REQUIRED],
        'id' => [Validator::REQUIRED],
        'description' => [Validator::REQUIRED],
        'price' => [Validator::REQUIRED],
        'image_url' => [Validator::REQUIRED],
        'is_available' => [Validator::REQUIRED],
        'salads' => [Validator::REQUIRED_ARRAY],
    ]);

    if (count($errors) === 0) {
        $name = $contents['name'];
        $foodId = $contents['id'];
        $description = $contents['description'];
        $price = $contents['price'];
        $image_url = $contents['image_url'];
        $is_available = $contents['is_available'];
        $salads = $contents['salads'];

        $insertData = [
            'name' => $name,
            'description' => $description,
            'price' => $price,
            'image_url' => $image_url,
            'is_available' => $is_available ? 1 : 0,
        ];
        $app->getDatabase()->query('UPDATE food_items SET', $insertData, 'WHERE food_id = ?', $foodId);

        foreach($salads as $saladKey => $saladValue) {
            echo $saladKey;
            $saladInsertData = [
                'food_id' => $foodId,
                'salad_sauce_id' => $saladKey

            ];
            $app->getDatabase()->query('INSERT INTO food_sauce_salad', $saladInsertData);
        }
        $app->sendJson(['status' => 'ok']);
    } else {
        $app->sendJson([
            'status' => 'fail',
            'errors' => $errors
        ], 422);
    }
}

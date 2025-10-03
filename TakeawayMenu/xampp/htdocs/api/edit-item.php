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
        'itemName' => [Validator::REQUIRED, Validator::STRING],
        'itemId' => [Validator::REQUIRED, Validator::INTEGER],
        'itemDesc' => [Validator::REQUIRED, Validator::STRING],
        'itemPrice' => [Validator::REQUIRED, Validator::FLOAT],
        'itemInStock' => [Validator::REQUIRED_BOOL],
    ]);

    if (count($errors) === 0) {
        $name = $contents['itemName'];
        $foodId = $contents['itemId'];
        $description = $contents['itemDesc'];
        $price = $contents['itemPrice'];

        $insertData = [
            'name' => $name,
            'description' => $description,
            'price' => $price,
            'is_available' => $contents['itemInStock'] == true,
        ];
        $app->getDatabase()->query('UPDATE food_items SET', $insertData, 'WHERE food_id = ?', $foodId);
        $items = $app->getFoodUtil()->formatFood($app->getDatabase());
        $app->sendJson(
            [
                'status' => 'ok',
                'items' => $items,
            ], 200);
    } else {
        $app->sendJson([
            'status' => 'fail',
            'errors' => $errors
        ], 422);
    }
}

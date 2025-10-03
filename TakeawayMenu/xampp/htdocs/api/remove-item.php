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
        'itemId' => [Validator::REQUIRED, Validator::INTEGER],
    ]);

    if (count($errors) === 0) {
        $itemId = $contents['itemId'];
        $app->getDatabase()->query('DELETE FROM basket_item WHERE item_id=?', $itemId);
        $app->getDatabase()->query('DELETE FROM food_items WHERE food_id=?', $itemId);
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

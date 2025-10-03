<?php

class FoodFormatter
{

    public function formatFood($database)
    {
        $categorys = $database->query('SELECT * from category');
        $categoryData = [];
        foreach($categorys as $category) {
            $items = [];
            $salads = [];
            $foodItems = $database->query('SELECT * from food_items WHERE category_id = ?', [$category->category_id]);
            $saladIds = $database->query('SELECT * from food_sauce_salad WHERE category_id = ?', [$category->category_id]);
            foreach($saladIds as $saladId) {
                $saladData = $database->query('SELECT name from salad_sauce_option WHERE salad_sauce_id = ?', [$saladId->salad_sauce_id])->fetchAll();
                $salads[] = [
                    'id' => $saladId->salad_sauce_id,
                    'name' => $saladData[0]->name
                ];
            }

            foreach($foodItems as $item) {
                $items[] = [
                    'id' => intval($item->food_id),
                    'name' => $item->name,
                    'description' => $item->description,
                    'price' => $item->price,
                    'is_available' => $item->is_available == 1 ? true : false,
                ];
            }

            $categoryData[] = [
                'id' => $category->category_id,
                'name' => $category->category_name,
                'description' => $category->category_description,
                'items' => $items,
                'salads' => $salads
            ];




        }
        return $categoryData;

    }

    public function formatSalads($database) {
        $salads = [];
        $saladOptions =  $database->query('SELECT * from salad_sauce_option');
        foreach($saladOptions as $saladOption) {
            $salads[] = [
                'id' => $saladOption->salad_sauce_id,
                'name' => $saladOption->name,
            ];

        }

        return $salads;
    }

    public function formatForStripe($database, $userBasket) {
        $lineItems = [];
        
        foreach($userBasket as $userBasketItem) {
            $lineItems[] = [
                "quantity" => 1,
                "price_data" => [
                    "currency" => "gbp",
                    "unit_amount" => $userBasketItem["item_price"] * 100,
                    "product_data" => [
                        "name" => $userBasketItem["item_name"],
                    ],
                ]
            ];
        }

        return $lineItems;
    }


}
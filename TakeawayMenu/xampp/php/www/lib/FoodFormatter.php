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
                'items' => $items,
                'salads' => $salads
            ];

            return $categoryData;
//        $app->getFoodUtil()


        }
    }


}
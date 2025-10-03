<?php

class ToppingsFormatter
{

    public function formatToppings($database, $basket_item_id)
    {
        $itemToppingsIds = $database->query('SELECT * FROM basket_item_topping WHERE basket_item_id = ?', $basket_item_id);
        $toppings = [];
        foreach($itemToppingsIds as $itemTopping) {
            $toppingData = $database->query('SELECT name FROM salad_sauce_option WHERE salad_sauce_id = ?', $itemTopping->salad_sauce_id);
            $toppingName = $toppingData->fetchSingle();
            $toppings[] = [
                'name' => $toppingName,
            ];
        }
        return $toppings;
    }


}
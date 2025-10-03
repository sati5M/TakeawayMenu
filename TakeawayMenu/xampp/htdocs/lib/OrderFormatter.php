<?php

class OrderFormatter
{

    public function formatOrders($database)
    {
        $orders = $database->query('SELECT * from orders');
        $orderData = [];
        foreach($orders as $order) {
            $items = [];
            $foodItems = $database->query('SELECT * from order_item WHERE order_id = ?', [$order->order_id]);
            foreach($foodItems as $foodData) {
                $toppingOrderData = [];
                $toppings = $database->query('SELECT * from order_item_topping WHERE order_item_id = ?', [$foodData->order_item_id]);
                foreach($toppings as $topping) {
                    $toppingName = $database->query('SELECT name FROM salad_sauce_option WHERE salad_sauce_id = ?', $topping->salad_sauce_id)->fetchSingle();
                    $toppingOrderData[] = [
                        'id' => $topping->order_item_topping_id,
                        'name' => $toppingName,
                    ];
                    

                }
                $itemName = $database->query('SELECT name FROM food_items WHERE food_id = ?', $foodData->food_id)->fetchSingle();
                $items[] = [
                    'id' => $foodData->order_item_id,
                    'name' => $itemName,
                    'price' => $foodData->price,
                    'toppings' => $toppingOrderData
                ];
            }   
            $orderData[] = [
                'id' => $order->order_id,
                'order_date' => $order->order_date,
                'postcode' => $order->postcode,
                'delivery_address' => $order->delivery_address,
                'phone_number' => $order->phone_number,
                'total_price' => $order->total_amount,
                'status' => $order->status,
                'items' => $items,
            ];



        }
        return $orderData;

    }

}
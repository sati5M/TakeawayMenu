<?php


class Basket

{

    /**
     * @var string
     */
    private $basketId;
    /**
     * @var string
     */
    private $userId;

    /**
     * @var \Dibi\Connection
     */
    private $database;

    /**
     * @var ToppingsFormatter
     */
    private $toppingsUtil;


    public function __construct(
        int $basketId,
        int $userId,
        \Dibi\Connection $database,
        ToppingsFormatter $toppingsUtil
    )
    {
        $this->basketId = $basketId;
        $this->userId = $userId;
        $this->database = $database;
        $this->toppingsUtil = $toppingsUtil;

    }



    public function getUserBasket(): array
    {
        $basket = [];
        $itemsInBasket = $this->database->query('SELECT * FROM basket_item WHERE basket_id = ?', $this->basketId);

        foreach ($itemsInBasket as $item) {
            $itemDataQuery = $this->database->query('SELECT * FROM food_items WHERE food_id = ?', $item['item_id'])->fetchAll();
            $itemData = $itemDataQuery[0];
            $basket[$item['basket_item_id']] = [
                'basket_item_id' => $item['basket_item_id'],
                'item_id' => $item['item_id'],
                'item_price' => $itemData->price,
                'item_name' => $itemData->name,
                'toppings' => $this->toppingsUtil->formatToppings($this->database, $item->basket_item_id)
            ];
        }
        return $basket;
    }

    public function addItemToBasket($item_id, $toppings)
    {
        $this->database->query('INSERT INTO basket_item',
            [
                'item_id' => $item_id,
                'basket_id' => $this->basketId,
            ]
        );
        $basketItemId = $this->database->getInsertId();

        foreach ($toppings as $toppingData) {
            $this->database->query('INSERT INTO basket_item_topping',
                [
                    'salad_sauce_id' => $toppingData['id'],
                    'basket_item_id' => $basketItemId,
                ]
            );
        }
    }

    public function removeItemFromBasket($basketItemId)
    {

        $this->database->query('DELETE FROM basket_item_topping WHERE basket_item_id = ?', $basketItemId);
        $this->database->query('DELETE FROM basket_item WHERE basket_item_id = ?', $basketItemId);
    }

    public function getBasketTotal($basketData)
    {
        $total = 0;
        foreach ($basketData as $basketItemData) {
            $total += $basketItemData['item_price'];
        }
        return $total;
    }

    public function addEntryToOrders($sessionData, $basketData)
    {
        $this->database->query('INSERT INTO orders',
        [
            'user_id' => $this->userId,
            'order_date' => new DateTime(),
            'total_amount' => $this->getBasketTotal($basketData),
            'postcode' => $sessionData->metadata->postcode,
            'delivery_address' => $sessionData->metadata->address,
            'phone_number' => $sessionData->metadata->number,
            'status' => "Ordered",
            'payment_status' => "Paid",
        ]);

        return $this->database->getInsertId();
    }

    public function addItemToOrder($orderId, $basketItemData)
    {
        $this->database->query('INSERT INTO order_item',
        [
            'order_id' => $orderId,
            'food_id' => $basketItemData['item_id'],
            'price' => $basketItemData['item_price'],
            'quantity' => 1,
        ]);

        $orderItemId = $this->database->getInsertId();
        $this->addToppingToOrderItem($basketItemData['toppings'], $orderItemId);
    }

    public function addToppingToOrderItem($toppings, $orderItemId)
    {
        foreach ($toppings as $topping) {
            $this->database->query('INSERT INTO order_item_topping',
            [
                'order_item_id' => $orderItemId,
                'salad_sauce_id' => $topping['id'],
            ]);
        }
    }

    public function deleteUserBasket()
    {
        $this->database->query('DELETE FROM basket WHERE basket_id = ?', $this->basketId);
    }

    public function setBasketAsOrdered($sessionData)
    {
        $basketData = $this->getUserBasket();
        $orderId = $this->addEntryToOrders($sessionData, $basketData);
        foreach($basketData as $basketItemData) {
            $this->removeItemFromBasket($basketItemData['basket_item_id']);
            $this->addItemToOrder($orderId, $basketItemData);
        }
        $this->deleteUserBasket();
    }

}
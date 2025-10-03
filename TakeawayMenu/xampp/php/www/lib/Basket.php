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

        foreach ($toppings as $toppingId => $_) {
            $this->database->query('INSERT INTO basket_item_topping',
                [
                    'salad_sauce_id' => $toppingId,
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

}
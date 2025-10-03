<?php

class User
{
    /**
     * @var string
     */
    private $firstName;
    /**
     * @var string
     */
    private $lastName;
    /**
     * @var string
     */
    private $email;
    /**
     * @var string
     */
    private $address;
    /**
     * @var string
     */
    private $phone;
    /**
     * @var bool
     */
    private $isAdmin;
    /**
     * @var DateTime
     */
    private $createdAt;
    /**
     * @var DateTime
     */
    private $updatedAt;
    /**
     * @var int
     */
    private $id;

    public function __construct(
        int $id,
        string $firstName,
        string $lastName,
        string $email,
        string $address,
        string $phone,
        bool $isAdmin,
        DateTime $createdAt,
        DateTime $updatedAt
    )
    {
        $this->firstName = $firstName;
        $this->lastName = $lastName;
        $this->email = $email;
        $this->address = $address;
        $this->phone = $phone;
        $this->isAdmin = $isAdmin;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
        $this->id = $id;
    }

    public function getFirstName(): string
    {
        return $this->firstName;
    }

    public function getLastName(): string
    {
        return $this->lastName;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function getAddress(): string
    {
        return $this->address;
    }

    public function getPhone(): string
    {
        return $this->phone;
    }

    public function isAdmin(): bool
    {
        return $this->isAdmin;
    }

    public function getCreatedAt(): DateTime
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): DateTime
    {
        return $this->updatedAt;
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getBasketId($app): int {
        $basketsWithUserId = $app->getDatabase()->query('SELECT * from basket WHERE user_id = ?', $this->id);
        $basketId = null;
        if (count($basketsWithUserId) === 0) {
            $app->sendJson([
                'status' => 'fail',
                'errors' => [
                    "basket" => "Error. Basket is empty"
                ],
            ], 422);
            return 0;
        }


        return $basketsWithUserId->fetchAll()[0]->basket_id;
    }


}
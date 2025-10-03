<?php


class Application
{

    private $method;

    /**
     * @var \Dibi\Connection
     */
    private $database;

    /**
     * @var Validator
     */
    private $validator;
    /**
     * @var User|null
     */
    private $user;


    /**
     * @var ToppingsFormatter
     */
    private $toppingsUtil;

    /**
     * @var FoodFormatter
     */
    private $foodUtil;

    /**
     * @var OrderFormatter
     */
    private $orderUtil;

    public function __construct(
        string $method,
        \Dibi\Connection $database,
        Validator $validator,
        $user,
        ToppingsFormatter $toppingsFormatter,
        FoodFormatter $foodFormatter,
        OrderFormatter $orderUtil
    ) {
        $this->method = $method;
        $this->database = $database;
        $this->validator = $validator;
        $this->user = $user;
        $this->toppingsUtil = $toppingsFormatter;
        $this->foodUtil = $foodFormatter;
        $this->orderUtil = $orderUtil;
    }

    public function isPost()
    {
        return $this->method == 'POST';
    }

    public function isGet()
    {
        return $this->method == 'GET';
    }
    public function isOptions()
    {
        return $this->method == 'OPTIONS';
    }

    public function getDatabase(): \Dibi\Connection
    {
        return $this->database;
    }

    public function getToppingsUtil(): ToppingsFormatter
    {

        return $this->toppingsUtil;
    }

    public function getFoodUtil(): FoodFormatter
    {

        return $this->foodUtil;
    }

    public function getOrderUtil(): OrderFormatter
    {

        return $this->orderUtil;
    }

    public function getPostContents()
    {
        $requestBody = file_get_contents('php://input');
        return json_decode($requestBody, true);
    }

    public function sendJson(array $data, int $statusCode = 200)
    {
        header('Content-Type: application/json');
        http_response_code($statusCode);
        echo json_encode($data);
    }

    public function getValidator(): Validator
    {
        return $this->validator;
    }

    /**
     * @return User|null
     */
    public function getUser()
    {
        return $this->user;
    }

    public function isLoggedIn()
    {
        return $this->getUser() !== null;
    }

}
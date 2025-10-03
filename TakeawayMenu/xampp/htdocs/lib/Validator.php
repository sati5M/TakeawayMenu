<?php

class Validator
{
    CONST EMAIL = 'email';
    const REQUIRED  = 'required';
    const REQUIRED_ARRAY  = 'required_array';
    const PHONE_NUMBER  = 'phone_number';
    CONST REQUIRED_BOOL = 'required_bool';
    CONST FLOAT = 'float';
    CONST INTEGER = 'integer';
    CONST STRING = 'string';
    CONST MAX_7_LETTERS = 'max_7_letters';
    CONST MIN_5_LETTERS = 'min_5_letters';
    CONST MIN_8_LETTERS = 'min_8_letters';
    CONST MAX_5 = 'max_5';
    CONST MIN_1 = 'min_1';

    public function validate($data, array $rules): array
    {

        if ($data === null) {
            return ["general" => ["POST Content is missing."]];
        }

        $errors = [];

        foreach($rules as $keyName => $constraints) {
            foreach($constraints as $constraint) {
                if (array_key_exists($keyName, $data)) {

                    if ($constraint === self::REQUIRED_BOOL) {
                        if (gettype($data[$keyName]) != "boolean") {
                            $errors = $this->appendError($errors, $keyName, 'Field %s must be a boolean');
                        }
                    }

                    if ($constraint === self::REQUIRED) {
                        if (strlen($data[$keyName]) == 0) {
                            $errors = $this->appendError($errors, $keyName, 'Field %s must not be empty');
                        }
                    }

                    if ($constraint === self::PHONE_NUMBER) {
                        if (strlen($data[$keyName]) != 13) {
                            $errors = $this->appendError($errors, $keyName, 'The number needs 13 characters (+44 format)');
                        } elseif ($data[$keyName][0] != "+" || $data[$keyName][1] != "4" || $data[$keyName][2] != "4") {
                            $errors = $this->appendError($errors, $keyName, 'The number needs to use the +44 format');
                        }

                    }

                    if ($constraint === self::REQUIRED_ARRAY) {
                        if (!$data[$keyName]) {
                            $errors = $this->appendError($errors, $keyName, 'You need to provide salad and sauce options');

                        }
                    }

                    if ($constraint === self::INTEGER) {
                        if (gettype(intval($data[$keyName])) != 'integer') {
                            $errors = $this->appendError($errors, $keyName, 'Field %s must be an integer');
                        }
                    }

                    if ($constraint === self::INTEGER) {
                        if (filter_var($data[$keyName], FILTER_VALIDATE_INT) === false) {
                            $errors = $this->appendError($errors, $keyName, 'Field %s must be an integer');
                        }
                    }

                    if ($constraint === self::FLOAT) {
                        if (filter_var($data[$keyName], FILTER_VALIDATE_FLOAT) == false && filter_var($data[$keyName], FILTER_VALIDATE_INT) == false) {
                            $errors = $this->appendError($errors, $keyName, 'Field %s must be an float');
                        }
                    }

                    if ($constraint === self::STRING) {
                        if (gettype(($data[$keyName])) != 'string') {
                            $errors = $this->appendError($errors, $keyName, 'Field %s must be an string');
                        }
                    }

                    if ($constraint === self::MAX_5) {
                        if ($data[$keyName] > 5) {
                            $errors = $this->appendError($errors, $keyName, 'Field %s must be less than 5');
                        } 
                        
                    }

                    if ($constraint === self::MIN_1) {
                        if ($data[$keyName] < 1) {
                            $errors = $this->appendError($errors, $keyName, 'Field %s must be more than 1');
                        }
                    }

                    
                    if ($constraint === self::MAX_7_LETTERS) {
                        if (strlen($data[$keyName]) > 7) {
                            $errors = $this->appendError($errors, $keyName, 'Field %s must be less than 7 letters');
                        } 
                        
                    }

                    if ($constraint === self::MIN_5_LETTERS) {
                        if (strlen($data[$keyName]) < 5) {
                            $errors = $this->appendError($errors, $keyName, 'Field %s must be more than 5 letters');
                        }
                    }

                    if ($constraint === self::MIN_8_LETTERS) {
                        if (strlen($data[$keyName]) < 8) {
                            $errors = $this->appendError($errors, $keyName, 'Field %s must be more than 8 letters');
                        }
                    }
                    
                    if ($constraint === self::EMAIL) {
                        if (!filter_var($data[$keyName], FILTER_VALIDATE_EMAIL)) {
                            $errors = $this->appendError($errors, $keyName, 'Field %s must be in an email format');
                        }
                    }
                    
                    
                } else {
                    $errors = $this->appendError($errors, $keyName, 'Required field %s is missing');
                }
            }
        }

        return $errors;
    }

    private function appendError(array $errors, string $keyName, string $error)
    {
        if(array_key_exists($keyName, $errors) === false) {
            $errors[$keyName] = [];
            $errors[$keyName][] = sprintf($error, $keyName);
        }

        return $errors;
    }

}
<?php

class Validator
{
    const REQUIRED  = 'required';
    const REQUIRED_ARRAY  = 'required_array';
    const NUMBER  = 'number';

    public function validate($data, array $rules): array
    {

        if ($data === null) {
            return ["general" => ["POST Content is missing."]];
        }

        $errors = [];

        foreach($rules as $keyName => $constraints) {
            foreach($constraints as $constraint) {
                if (array_key_exists($keyName, $data)) {
                    if ($constraint === self::REQUIRED) {
                        if (strlen($data[$keyName]) == 0) {
                            $errors = $this->appendError($errors, $keyName, 'Field %s must not be empty');
                        }
                    }

                    if ($constraint === self::NUMBER) {
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
        }
        $errors[$keyName][] = sprintf($error, $keyName);

        return $errors;
    }

}
export function DoesErrorExist(response)  {
    if (response?.response?.data?.errors) {
        return true
    }
    return false
}

from app.utils.validators import validate_card_number, validate_expiry


def test_valid_visa():
    result = validate_card_number("4111111111111111")
    assert result["valid"] is True
    assert result["card_type"] == "Visa"


def test_valid_mastercard():
    result = validate_card_number("5500000000000004")
    assert result["valid"] is True
    assert result["card_type"] == "Mastercard"


def test_invalid_card():
    result = validate_card_number("1234567890123456")
    assert result["valid"] is False


def test_non_numeric():
    result = validate_card_number("abcd-efgh-ijkl")
    assert result["valid"] is False


def test_expiry_future():
    assert validate_expiry(12, 2030) is True


def test_expiry_past():
    assert validate_expiry(1, 2020) is False

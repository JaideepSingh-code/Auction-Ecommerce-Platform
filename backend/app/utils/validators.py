"""Card validation utilities using the Luhn algorithm."""


def validate_card_number(card_number: str) -> dict:
    """
    Validate a credit card number using the Luhn algorithm.
    Returns validation result with card type detection.
    """
    # Strip spaces and dashes
    cleaned = card_number.replace(" ", "").replace("-", "")

    if not cleaned.isdigit():
        return {"valid": False, "error": "Card number must contain only digits"}

    if len(cleaned) < 13 or len(cleaned) > 19:
        return {"valid": False, "error": "Invalid card number length"}

    # Luhn algorithm
    digits = [int(d) for d in cleaned]
    checksum = 0
    reverse = digits[::-1]

    for i, d in enumerate(reverse):
        if i % 2 == 1:
            d *= 2
            if d > 9:
                d -= 9
        checksum += d

    is_valid = checksum % 10 == 0

    # Detect card type
    card_type = _detect_card_type(cleaned)

    return {
        "valid": is_valid,
        "card_type": card_type,
        "last_four": cleaned[-4:],
    }


def _detect_card_type(number: str) -> str:
    """Detect the card network from the card number prefix."""
    if number.startswith("4"):
        return "Visa"
    elif number[:2] in ("51", "52", "53", "54", "55"):
        return "Mastercard"
    elif number[:2] in ("34", "37"):
        return "American Express"
    elif number[:4] == "6011" or number[:2] == "65":
        return "Discover"
    return "Unknown"


def validate_expiry(month: int, year: int) -> bool:
    """Check if a card expiry date is in the future."""
    from datetime import datetime
    now = datetime.utcnow()
    if year > now.year:
        return True
    if year == now.year and month >= now.month:
        return True
    return False

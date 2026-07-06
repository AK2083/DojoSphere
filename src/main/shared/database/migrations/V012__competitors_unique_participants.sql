-- Prevent duplicate participants by pass number, license number, or fallback identity.

CREATE UNIQUE INDEX IF NOT EXISTS idx_competitors_pass_number_unique
ON competitors(pass_number)
WHERE trim(pass_number) != '00000000';

CREATE UNIQUE INDEX IF NOT EXISTS idx_competitors_license_number_unique
ON competitors(license_number)
WHERE license_number IS NOT NULL AND trim(license_number) != '';

CREATE UNIQUE INDEX IF NOT EXISTS idx_competitors_identity_fallback_unique
ON competitors(
  lower(trim(given_name)),
  lower(trim(family_name)),
  birth_date
)
WHERE trim(pass_number) = '00000000'
  AND (license_number IS NULL OR trim(license_number) = '');

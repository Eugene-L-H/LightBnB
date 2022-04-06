SELECT properties.city, COUNT(reservations) as total_reservations
FROM properties
INNER JOIN reservations ON properties.id = property_id
GROUP BY properties.city
ORDER BY total_reservations DESC;
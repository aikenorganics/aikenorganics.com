ALTER TABLE ONLY user_growers
DROP CONSTRAINT user_growers_grower_id_fkey,
ADD CONSTRAINT user_growers_grower_id_fkey
FOREIGN KEY (grower_id)
REFERENCES growers(id)
ON DELETE CASCADE;

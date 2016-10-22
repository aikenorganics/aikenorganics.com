update events set product_id = (meta::json->'id')::text::integer where target = 'products';
update events set grower_id = (meta::json->'id')::text::integer where target = 'growers';

-- ============================================
-- AmarShop Materialized Views for Reporting
-- ============================================

-- Daily Sales Summary
CREATE MATERIALIZED VIEW mv_daily_sales AS
SELECT
    DATE(o.created_at) AS sale_date,
    COUNT(DISTINCT o.id) AS total_orders,
    COUNT(DISTINCT o.user_id) AS unique_customers,
    SUM(o.total) AS total_revenue,
    SUM(o.shipping) AS total_shipping,
    SUM(o.discount) AS total_discount,
    AVG(o.total) AS avg_order_value,
    COUNT(DISTINCT CASE WHEN o.status = 'CANCELLED' THEN o.id END) AS cancelled_orders,
    COUNT(DISTINCT CASE WHEN o.status = 'RETURNED' THEN o.id END) AS returned_orders
FROM orders o
GROUP BY DATE(o.created_at)
WITH DATA;

CREATE UNIQUE INDEX idx_mv_daily_sales_date ON mv_daily_sales(sale_date);

-- Seller Performance
CREATE MATERIALIZED VIEW mv_seller_performance AS
SELECT
    s.id AS seller_id,
    s.name AS seller_name,
    COUNT(DISTINCT p.id) AS total_products,
    COUNT(DISTINCT o.id) AS total_orders,
    COUNT(DISTINCT oi.id) AS total_items_sold,
    COALESCE(SUM(oi.price * oi.quantity), 0) AS total_sales,
    COALESCE(SUM(o.total), 0) AS total_revenue,
    AVG(r.rating) AS avg_rating,
    COUNT(DISTINCT r.id) AS total_reviews,
    COUNT(DISTINCT f.id) AS total_followers
FROM stores s
LEFT JOIN products p ON p.store_id = s.id
LEFT JOIN order_items oi ON oi.product_id = p.id
LEFT JOIN orders o ON o.id = oi.order_id AND o.status = 'DELIVERED'
LEFT JOIN reviews r ON r.product_id = p.id
LEFT JOIN store_followers f ON f.store_id = s.id
GROUP BY s.id, s.name
WITH DATA;

CREATE UNIQUE INDEX idx_mv_seller_performance_id ON mv_seller_performance(seller_id);

-- Product Performance
CREATE MATERIALIZED VIEW mv_product_performance AS
SELECT
    p.id AS product_id,
    p.name AS product_name,
    p.slug,
    c.name AS category_name,
    s.name AS seller_name,
    p.price,
    p.original_price,
    p.stock_count,
    p.sold_count,
    COALESCE(AVG(r.rating), 0) AS avg_rating,
    COUNT(DISTINCT r.id) AS review_count,
    COUNT(DISTINCT oi.id) AS order_count,
    COALESCE(SUM(oi.quantity), 0) AS units_sold,
    COALESCE(SUM(oi.price * oi.quantity), 0) AS revenue,
    COUNT(DISTINCT w.user_id) AS wishlist_count,
    COUNT(DISTINCT ci.id) AS cart_count
FROM products p
LEFT JOIN categories c ON c.id = p.category_id
LEFT JOIN stores s ON s.id = p.store_id
LEFT JOIN reviews r ON r.product_id = p.id
LEFT JOIN order_items oi ON oi.product_id = p.id
LEFT JOIN wishlist_items w ON w.product_id = p.id
LEFT JOIN cart_items ci ON ci.product_id = p.id
GROUP BY p.id, p.name, p.slug, c.name, s.name, p.price, p.original_price, p.stock_count, p.sold_count
WITH DATA;

CREATE UNIQUE INDEX idx_mv_product_performance_id ON mv_product_performance(product_id);

-- Category Performance
CREATE MATERIALIZED VIEW mv_category_performance AS
SELECT
    c.id AS category_id,
    c.name AS category_name,
    COUNT(DISTINCT p.id) AS total_products,
    COUNT(DISTINCT oi.id) AS total_items_sold,
    COALESCE(SUM(oi.price * oi.quantity), 0) AS total_revenue,
    COUNT(DISTINCT o.id) AS total_orders,
    AVG(r.rating) AS avg_rating,
    AVG(p.price) AS avg_price
FROM categories c
LEFT JOIN products p ON p.category_id = c.id
LEFT JOIN order_items oi ON oi.product_id = p.id
LEFT JOIN orders o ON o.id = oi.order_id AND o.status = 'DELIVERED'
LEFT JOIN reviews r ON r.product_id = p.id
GROUP BY c.id, c.name
WITH DATA;

CREATE UNIQUE INDEX idx_mv_category_performance_id ON mv_category_performance(category_id);

-- Customer Lifetime Value
CREATE MATERIALIZED VIEW mv_customer_ltv AS
SELECT
    u.id AS user_id,
    u.name AS user_name,
    u.phone,
    u.created_at AS registration_date,
    COUNT(DISTINCT o.id) AS total_orders,
    COALESCE(SUM(o.total), 0) AS total_spent,
    COALESCE(AVG(o.total), 0) AS avg_order_value,
    MAX(o.created_at) AS last_order_date,
    EXTRACT(DAY FROM NOW() - MAX(o.created_at)) AS days_since_last_order,
    COUNT(DISTINCT r.id) AS total_reviews,
    CASE
        WHEN COALESCE(SUM(o.total), 0) > 100000 THEN 'PLATINUM'
        WHEN COALESCE(SUM(o.total), 0) > 50000 THEN 'GOLD'
        WHEN COALESCE(SUM(o.total), 0) > 10000 THEN 'SILVER'
        ELSE 'REGULAR'
    END AS customer_tier
FROM users u
LEFT JOIN orders o ON o.user_id = u.id AND o.status = 'DELIVERED'
LEFT JOIN reviews r ON r.user_id = u.id
GROUP BY u.id, u.name, u.phone, u.created_at
WITH DATA;

CREATE UNIQUE INDEX idx_mv_customer_ltv_id ON mv_customer_ltv(user_id);

-- Inventory Status
CREATE MATERIALIZED VIEW mv_inventory_status AS
SELECT
    p.id AS product_id,
    p.name AS product_name,
    p.sku,
    w.name AS warehouse_name,
    w.city AS warehouse_city,
    i.quantity AS current_stock,
    i.reserved_qty,
    i.low_stock_qty,
    (i.quantity - i.reserved_qty) AS available_stock,
    CASE
        WHEN i.quantity <= i.low_stock_qty THEN 'LOW_STOCK'
        WHEN i.quantity = 0 THEN 'OUT_OF_STOCK'
        ELSE 'IN_STOCK'
    END AS stock_status,
    im.last_movement_date AS last_restocked
FROM inventory i
JOIN products p ON p.id = i.product_id
JOIN warehouses w ON w.id = i.warehouse_id
LEFT JOIN (
    SELECT inventory_id, MAX(created_at) AS last_movement_date
    FROM inventory_movements
    WHERE type = 'RESTOCK'
    GROUP BY inventory_id
) im ON im.inventory_id = i.id
WITH DATA;

CREATE UNIQUE INDEX idx_mv_inventory_status_id ON mv_inventory_status(product_id, warehouse_name);

-- Hourly Traffic / Activity
CREATE MATERIALIZED VIEW mv_hourly_activity AS
SELECT
    DATE_TRUNC('hour', ua.created_at) AS hour_slot,
    COUNT(DISTINCT ua.user_id) AS unique_users,
    COUNT(*) AS total_events,
    COUNT(CASE WHEN ua.action = 'VIEW_PRODUCT' THEN 1 END) AS product_views,
    COUNT(CASE WHEN ua.action = 'ADD_TO_CART' THEN 1 END) AS cart_adds,
    COUNT(CASE WHEN ua.action = 'PURCHASE' THEN 1 END) AS purchases,
    COUNT(CASE WHEN ua.action = 'SEARCH' THEN 1 END) AS searches
FROM user_activities ua
GROUP BY DATE_TRUNC('hour', ua.created_at)
WITH DATA;

CREATE UNIQUE INDEX idx_mv_hourly_activity ON mv_hourly_activity(hour_slot);

-- Refresh Functions
CREATE OR REPLACE FUNCTION refresh_all_materialized_views()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_daily_sales;
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_seller_performance;
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_product_performance;
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_category_performance;
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_customer_ltv;
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_inventory_status;
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_hourly_activity;
END;
$$ LANGUAGE plpgsql;

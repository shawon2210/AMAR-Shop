# AmarShop Domain Event Catalog

## Order Events (13)
| Event | Description | Producer | Consumers |
|-------|------------|----------|-----------|
| `order.placed` | Customer places an order | Order Service | Inventory, Payment, Notification, Analytics |
| `order.confirmed` | Order confirmed after payment | Payment Service | Fulfillment, Notification |
| `order.processing` | Order picked and being packed | Fulfillment Service | Notification, Analytics |
| `order.shipped` | Order handed to courier | Fulfillment Service | Notification, Analytics |
| `order.partially_shipped` | Partial shipment sent | Fulfillment Service | Notification, Order |
| `order.delivered` | Customer received order | Fulfillment Service | Notification, Analytics, Loyalty |
| `order.cancelled` | Order cancelled by customer/system | Order Service | Payment, Inventory, Notification |
| `order.refunded` | Payment refunded to customer | Payment Service | Notification, Analytics |
| `order.return_requested` | Customer initiated return | Order Service | Fulfillment, Notification |
| `order.return_approved` | Return request approved | Admin Service | Fulfillment, Payment |
| `order.return_received` | Returned item received at warehouse | Fulfillment Service | Payment, Inventory |
| `order.return_rejected` | Return request rejected | Admin Service | Notification |
| `order.modified` | Order details changed (address, etc.) | Order Service | Fulfillment, Notification |

## Payment Events (8)
| Event | Description | Producer | Consumers |
|-------|------------|----------|-----------|
| `payment.initiated` | Payment process started | Payment Service | Order, Analytics |
| `payment.completed` | Payment successfully processed | Payment Service | Order, Notification, Wallet |
| `payment.failed` | Payment processing failed | Payment Service | Order, Notification |
| `payment.refunded` | Payment refunded to customer | Payment Service | Order, Notification, Wallet |
| `payment.refund_failed` | Refund processing failed | Payment Service | Admin, Notification |
| `payment.disputed` | Customer disputed a payment | Payment Service | Admin, Order |
| `payment.settled` | Funds settled to seller account | Payment Service | Seller, Wallet |
| `payment.hold_released` | Payment hold released | Payment Service | Seller, Wallet |

## Inventory Events (6)
| Event | Description | Producer | Consumers |
|-------|------------|----------|-----------|
| `inventory.reserved` | Stock reserved for order | Inventory Service | Order, Product |
| `inventory.released` | Reserved stock released | Inventory Service | Order, Product |
| `inventory.deducted` | Stock deducted after shipment | Inventory Service | Product, Analytics |
| `inventory.restocked` | Stock added to warehouse | Inventory Service | Product, Notification |
| `inventory.low_stock` | Stock below threshold | Inventory Service | Seller, Admin, Notification |
| `inventory.out_of_stock` | Product out of stock | Inventory Service | Product, Search, Notification |

## User Events (7)
| Event | Description | Producer | Consumers |
|-------|------------|----------|-----------|
| `user.registered` | New user account created | Auth Service | Notification, Analytics, Loyalty |
| `user.logged_in` | User logged in | Auth Service | Analytics, Security |
| `user.profile_updated` | User profile changed | User Service | Search, Analytics |
| `user.verified` | User identity verified | Compliance Service | Seller, Notification |
| `user.deactivated` | User deactivated account | User Service | Order, Notification |
| `user.deleted` | User data deleted (GDPR) | Compliance Service | All services |
| `user.consent_updated` | User consent preferences changed | Compliance Service | Analytics, Marketing |

## Seller Events (7)
| Event | Description | Producer | Consumers |
|-------|------------|----------|-----------|
| `seller.registered` | New seller application | Seller Service | Admin, Notification |
| `seller.kyc_submitted` | KYC documents submitted | Seller Service | Compliance, Admin |
| `seller.kyc_approved` | KYC verification passed | Compliance Service | Seller, Notification |
| `seller.kyc_rejected` | KYC verification failed | Compliance Service | Seller, Notification |
| `seller.store_created` | Seller store launched | Seller Service | Search, Analytics |
| `seller.performance_updated` | Seller metrics changed | Analytics Service | Seller, Admin |
| `seller.payout_processed` | Seller payout completed | Payment Service | Seller, Wallet, Notification |

## Product Events (5)
| Event | Description | Producer | Consumers |
|-------|------------|----------|-----------|
| `product.created` | New product listed | Product Service | Search, Analytics, Seller |
| `product.updated` | Product details changed | Product Service | Search, Analytics |
| `product.deleted` | Product removed | Product Service | Search, Cart, Wishlist |
| `product.approved` | Product moderation passed | Admin Service | Seller, Notification, Search |
| `product.rejected` | Product moderation failed | Admin Service | Seller, Notification |

## Fulfillment Events (9)
| Event | Description | Producer | Consumers |
|-------|------------|----------|-----------|
| `fulfillment.pickup_scheduled` | Courier pickup arranged | Fulfillment Service | Order, Notification |
| `fulfillment.picked_up` | Package collected by courier | Fulfillment Service | Order, Tracking |
| `fulfillment.in_transit` | Package in transit | Courier Service | Order, Notification |
| `fulfillment.out_for_delivery` | Package out for last-mile | Courier Service | Order, Notification |
| `fulfillment.delivered` | Package delivered to customer | Courier Service | Order, Notification, Payment |
| `fulfillment.delivery_failed` | Delivery attempted but failed | Courier Service | Order, Notification |
| `fulfillment.return_picked_up` | Return item collected | Fulfillment Service | Order, Payment |
| `fulfillment.return_delivered` | Return received at warehouse | Fulfillment Service | Order, Payment, Inventory |
| `fulfillment.tracking_updated` | Tracking status changed | Courier Service | Order, Notification |

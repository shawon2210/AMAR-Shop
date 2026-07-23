# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cart-layout.spec.ts >> Cart page - empty cart >> shows Your Cart is Empty heading
- Location: e2e\cart-layout.spec.ts:77:7

# Error details

```
Test timeout of 30000ms exceeded while running "beforeEach" hook.
```

```
Error: page.goto: Test timeout of 30000ms exceeded.
Call log:
  - navigating to "http://localhost:3000/", waiting until "load"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - link "Skip to main content" [ref=e2] [cursor=pointer]:
    - /url: "#main-content"
  - generic [ref=e3]:
    - banner [ref=e4]:
      - generic [ref=e6]:
        - generic [ref=e7]:
          - link "help_outline Help Center" [ref=e8] [cursor=pointer]:
            - /url: /help
            - generic [ref=e9]: help_outline
            - text: Help Center
          - link "local_shipping Track Order" [ref=e10] [cursor=pointer]:
            - /url: /orders
            - generic [ref=e11]: local_shipping
            - text: Track Order
          - link "storefront Become a Seller" [ref=e12] [cursor=pointer]:
            - /url: /seller/dashboard
            - generic [ref=e13]: storefront
            - text: Become a Seller
        - generic [ref=e14]:
          - generic [ref=e15]:
            - generic [ref=e16]: verified
            - text: 100% Authentic Products
          - link "Offers & Deals" [ref=e17] [cursor=pointer]:
            - /url: /notifications
          - link "Download App" [ref=e18] [cursor=pointer]:
            - /url: /help
      - generic [ref=e20]:
        - link "AmarShop" [ref=e22] [cursor=pointer]:
          - /url: /
          - img "AmarShop" [ref=e23]
        - button "search Search products, brands & categories... search" [ref=e25]:
          - generic [ref=e26]:
            - generic: search
            - generic [ref=e27]: Search products, brands & categories...
            - generic [ref=e29]: search
        - generic [ref=e30]:
          - link "Notifications" [ref=e31] [cursor=pointer]:
            - /url: /notifications
            - generic [ref=e32]: notifications
          - link "Wishlist" [ref=e34] [cursor=pointer]:
            - /url: /account
            - generic [ref=e35]: favorite_border
          - link "Shopping cart" [ref=e36] [cursor=pointer]:
            - /url: /cart
            - generic [ref=e37]: shopping_cart
          - link "Sign In" [ref=e38] [cursor=pointer]:
            - /url: /auth/login
      - navigation "Category navigation" [ref=e41]:
        - link "Fashion" [ref=e42] [cursor=pointer]:
          - /url: /category/fashion
        - link "Electronics" [ref=e43] [cursor=pointer]:
          - /url: /category/electronics
        - link "Beauty" [ref=e44] [cursor=pointer]:
          - /url: /category/beauty
        - link "Groceries" [ref=e45] [cursor=pointer]:
          - /url: /category/groceries
        - link "Home & Living" [ref=e46] [cursor=pointer]:
          - /url: /category/home
        - link "Sports" [ref=e47] [cursor=pointer]:
          - /url: /category/sports
        - link "🔥 Flash Sale" [ref=e48] [cursor=pointer]:
          - /url: /flash-sale
    - main [ref=e49]:
      - generic [ref=e50]:
        - generic [ref=e53]:
          - generic [ref=e55]:
            - generic [ref=e59]:
              - generic [ref=e60]: Flash Sale
              - heading "Shop Smart, Live Better" [level=2] [ref=e61]
              - paragraph [ref=e62]: Fast delivery across Bangladesh.
              - link "Shop Now" [ref=e63] [cursor=pointer]:
                - /url: /categories
                - text: Shop Now
                - img [ref=e64]
            - generic [ref=e69]:
              - generic [ref=e70]: Eid Specials
              - heading [level=2] [ref=e71]: Huge Savings Await
              - paragraph [ref=e72]: Up to 50% off fashion & electronics.
              - link [ref=e73] [cursor=pointer]:
                - /url: /flash-sale
                - text: Explore Deals
                - img [ref=e74]
            - generic [ref=e79]:
              - generic [ref=e80]: Summer Sale
              - heading [level=2] [ref=e81]: Up to 70% Off
              - paragraph [ref=e82]: Limited time. Free shipping included.
              - link [ref=e83] [cursor=pointer]:
                - /url: /flash-sale
                - text: Shop Now
                - img [ref=e84]
            - generic [ref=e89]:
              - generic [ref=e90]: Tech Fest
              - heading [level=2] [ref=e91]: Latest Gadgets
              - paragraph [ref=e92]: Free shipping on all tech.
              - link [ref=e93] [cursor=pointer]:
                - /url: /category/electronics
                - text: Explore
                - img [ref=e94]
            - button "Previous slide" [ref=e96]:
              - img [ref=e97]
            - button "Next slide" [ref=e99]:
              - img [ref=e100]
            - generic [ref=e102]:
              - button "Slide 1" [ref=e103]
              - button "Slide 2" [ref=e105]
              - button "Slide 3" [ref=e106]
              - button "Slide 4" [ref=e107]
            - generic [ref=e108]: 01 / 04
          - generic [ref=e109]:
            - link "flash_on Flash Sale Up to 70% off today chevron_right" [ref=e110] [cursor=pointer]:
              - /url: /flash-sale
              - generic [ref=e112]: flash_on
              - generic [ref=e113]:
                - paragraph [ref=e114]: Flash Sale
                - paragraph [ref=e115]: Up to 70% off today
              - generic [ref=e116]: chevron_right
            - link "local_shipping Free Delivery On orders over ৳999 chevron_right" [ref=e117] [cursor=pointer]:
              - /url: "#"
              - generic [ref=e119]: local_shipping
              - generic [ref=e120]:
                - paragraph [ref=e121]: Free Delivery
                - paragraph [ref=e122]: On orders over ৳999
              - generic [ref=e123]: chevron_right
            - link "new_releases New Arrivals Fresh styles every day chevron_right" [ref=e124] [cursor=pointer]:
              - /url: /categories
              - generic [ref=e126]: new_releases
              - generic [ref=e127]:
                - paragraph [ref=e128]: New Arrivals
                - paragraph [ref=e129]: Fresh styles every day
              - generic [ref=e130]: chevron_right
            - link "storefront Sell on AmarShop Zero listing fees chevron_right" [ref=e131] [cursor=pointer]:
              - /url: /seller/dashboard
              - generic [ref=e133]: storefront
              - generic [ref=e134]:
                - paragraph [ref=e135]: Sell on AmarShop
                - paragraph [ref=e136]: Zero listing fees
              - generic [ref=e137]: chevron_right
        - generic [ref=e139]:
          - generic [ref=e140]:
            - img [ref=e141]
            - generic [ref=e143]: 4.8 Average Rating
          - generic [ref=e144]:
            - img [ref=e145]
            - generic [ref=e150]: Nationwide Delivery
          - generic [ref=e151]:
            - img [ref=e152]
            - generic [ref=e155]: Secure Payment
          - generic [ref=e156]:
            - img [ref=e157]
            - generic [ref=e160]: Easy Returns
          - generic [ref=e161]:
            - img [ref=e162]
            - generic [ref=e165]: Verified Sellers
          - generic [ref=e166]:
            - img [ref=e167]
            - generic [ref=e171]: Free Delivery
        - generic [ref=e178]:
          - generic [ref=e179]:
            - generic [ref=e180]:
              - heading "Flash Sale" [level=2] [ref=e185]
              - generic [ref=e186]:
                - generic [ref=e187]:
                  - generic [ref=e188]: "3868"
                  - generic [ref=e189]: hrs
                - generic [ref=e190]: ":"
                - generic [ref=e191]:
                  - generic [ref=e192]: "26"
                  - generic [ref=e193]: min
                - generic [ref=e194]: ":"
                - generic [ref=e195]:
                  - generic [ref=e196]: "20"
                  - generic [ref=e197]: sec
            - link "See All" [ref=e198] [cursor=pointer]:
              - /url: /flash-sale
              - text: See All
              - img [ref=e199]
          - generic [ref=e201]:
            - link "Samsung Galaxy S25 Ultra Flash Sale -20% Samsung Galaxy S25 Ultra Flash Sale ৳119,999 ৳149,999 72% sold 28% left Add to Cart" [ref=e202] [cursor=pointer]:
              - /url: /product/sale_1
              - generic [ref=e203]:
                - img "Samsung Galaxy S25 Ultra Flash Sale" [ref=e204]
                - generic [ref=e205]: "-20%"
              - generic [ref=e206]:
                - paragraph [ref=e207]: Samsung Galaxy S25 Ultra Flash Sale
                - generic [ref=e208]:
                  - generic [ref=e209]: ৳119,999
                  - generic [ref=e210]: ৳149,999
                - generic [ref=e212]:
                  - generic [ref=e213]: 72% sold
                  - generic [ref=e214]: 28% left
                - button "Add to Cart" [ref=e217]
            - link "Sony WH-1000XM6 Flash Deal -25% Sony WH-1000XM6 Flash Deal ৳29,999 ৳39,999 65% sold 35% left Add to Cart" [ref=e218] [cursor=pointer]:
              - /url: /product/sale_2
              - generic [ref=e219]:
                - img "Sony WH-1000XM6 Flash Deal" [ref=e220]
                - generic [ref=e221]: "-25%"
              - generic [ref=e222]:
                - paragraph [ref=e223]: Sony WH-1000XM6 Flash Deal
                - generic [ref=e224]:
                  - generic [ref=e225]: ৳29,999
                  - generic [ref=e226]: ৳39,999
                - generic [ref=e228]:
                  - generic [ref=e229]: 65% sold
                  - generic [ref=e230]: 35% left
                - button "Add to Cart" [ref=e233]
            - link "image -20% Apple AirPods Pro 3 Flash Sale ৳27,999 ৳34,999 78% sold 22% left Add to Cart" [ref=e234] [cursor=pointer]:
              - /url: /product/sale_3
              - generic [ref=e235]:
                - generic [ref=e237]: image
                - generic [ref=e238]: "-20%"
              - generic [ref=e239]:
                - paragraph [ref=e240]: Apple AirPods Pro 3 Flash Sale
                - generic [ref=e241]:
                  - generic [ref=e242]: ৳27,999
                  - generic [ref=e243]: ৳34,999
                - generic [ref=e245]:
                  - generic [ref=e246]: 78% sold
                  - generic [ref=e247]: 22% left
                - button "Add to Cart" [ref=e250]
            - link "MacBook Air M4 Flash Sale -17% MacBook Air M4 Flash Sale ৳129,000 ৳155,000 92% sold 8% left Add to Cart" [ref=e251] [cursor=pointer]:
              - /url: /product/sale_4
              - generic [ref=e252]:
                - img "MacBook Air M4 Flash Sale" [ref=e253]
                - generic [ref=e254]: "-17%"
              - generic [ref=e255]:
                - paragraph [ref=e256]: MacBook Air M4 Flash Sale
                - generic [ref=e257]:
                  - generic [ref=e258]: ৳129,000
                  - generic [ref=e259]: ৳155,000
                - generic [ref=e261]:
                  - generic [ref=e262]: 92% sold
                  - generic [ref=e263]: 8% left
                - button "Add to Cart" [ref=e266]
            - link "Dell XPS 16 Flash Deal -13% Dell XPS 16 Flash Deal ৳173,000 ৳199,000 45% sold 55% left Add to Cart" [ref=e267] [cursor=pointer]:
              - /url: /product/sale_5
              - generic [ref=e268]:
                - img "Dell XPS 16 Flash Deal" [ref=e269]
                - generic [ref=e270]: "-13%"
              - generic [ref=e271]:
                - paragraph [ref=e272]: Dell XPS 16 Flash Deal
                - generic [ref=e273]:
                  - generic [ref=e274]: ৳173,000
                  - generic [ref=e275]: ৳199,000
                - generic [ref=e277]:
                  - generic [ref=e278]: 45% sold
                  - generic [ref=e279]: 55% left
                - button "Add to Cart" [ref=e282]
            - link "Anker PowerCore Flash Sale -31% Anker PowerCore Flash Sale ৳4,799 ৳6,999 88% sold 12% left Add to Cart" [ref=e283] [cursor=pointer]:
              - /url: /product/sale_6
              - generic [ref=e284]:
                - img "Anker PowerCore Flash Sale" [ref=e285]
                - generic [ref=e286]: "-31%"
              - generic [ref=e287]:
                - paragraph [ref=e288]: Anker PowerCore Flash Sale
                - generic [ref=e289]:
                  - generic [ref=e290]: ৳4,799
                  - generic [ref=e291]: ৳6,999
                - generic [ref=e293]:
                  - generic [ref=e294]: 88% sold
                  - generic [ref=e295]: 12% left
                - button "Add to Cart" [ref=e298]
        - generic [ref=e301]:
          - generic [ref=e302]:
            - heading "Shop by Category" [level=2] [ref=e303]
            - link "View All chevron_right" [ref=e304] [cursor=pointer]:
              - /url: /categories
              - text: View All
              - generic [ref=e305]: chevron_right
          - generic [ref=e306]:
            - link "checkroom Fashion 12k+" [ref=e307] [cursor=pointer]:
              - /url: /category/fashion
              - generic [ref=e309]: checkroom
              - generic [ref=e310]:
                - paragraph [ref=e311]: Fashion
                - generic [ref=e312]: 12k+
            - link "devices Electronics 8.9k" [ref=e313] [cursor=pointer]:
              - /url: /category/electronics
              - generic [ref=e315]: devices
              - generic [ref=e316]:
                - paragraph [ref=e317]: Electronics
                - generic [ref=e318]: 8.9k
            - link "shopping_basket Groceries 15k+" [ref=e319] [cursor=pointer]:
              - /url: /category/groceries
              - generic [ref=e321]: shopping_basket
              - generic [ref=e322]:
                - paragraph [ref=e323]: Groceries
                - generic [ref=e324]: 15k+
            - link "chair Home & Living 6.8k" [ref=e325] [cursor=pointer]:
              - /url: /category/home
              - generic [ref=e327]: chair
              - generic [ref=e328]:
                - paragraph [ref=e329]: Home & Living
                - generic [ref=e330]: 6.8k
            - link "spa Beauty 4.5k" [ref=e331] [cursor=pointer]:
              - /url: /category/beauty
              - generic [ref=e333]: spa
              - generic [ref=e334]:
                - paragraph [ref=e335]: Beauty
                - generic [ref=e336]: 4.5k
            - link "sports_esports Toys & Games 3.2k" [ref=e337] [cursor=pointer]:
              - /url: /category/toys
              - generic [ref=e339]: sports_esports
              - generic [ref=e340]:
                - paragraph [ref=e341]: Toys & Games
                - generic [ref=e342]: 3.2k
            - link "fitness_center Sports 2.9k" [ref=e343] [cursor=pointer]:
              - /url: /category/sports
              - generic [ref=e345]: fitness_center
              - generic [ref=e346]:
                - paragraph [ref=e347]: Sports
                - generic [ref=e348]: 2.9k
            - link "stadia_controller Gaming 5.6k" [ref=e349] [cursor=pointer]:
              - /url: /category/gaming
              - generic [ref=e351]: stadia_controller
              - generic [ref=e352]:
                - paragraph [ref=e353]: Gaming
                - generic [ref=e354]: 5.6k
            - link "kitchen Appliances 4.3k" [ref=e355] [cursor=pointer]:
              - /url: /category/appliances
              - generic [ref=e357]: kitchen
              - generic [ref=e358]:
                - paragraph [ref=e359]: Appliances
                - generic [ref=e360]: 4.3k
            - link "menu_book Books 7.2k" [ref=e361] [cursor=pointer]:
              - /url: /category/books-stationery
              - generic [ref=e363]: menu_book
              - generic [ref=e364]:
                - paragraph [ref=e365]: Books
                - generic [ref=e366]: 7.2k
            - link "directions_car Automotive 2.1k" [ref=e367] [cursor=pointer]:
              - /url: /category/automotive
              - generic [ref=e369]: directions_car
              - generic [ref=e370]:
                - paragraph [ref=e371]: Automotive
                - generic [ref=e372]: 2.1k
            - link "grid_view More 10.0k" [ref=e373] [cursor=pointer]:
              - /url: /category/more
              - generic [ref=e375]: grid_view
              - generic [ref=e376]:
                - paragraph [ref=e377]: More
                - generic [ref=e378]: 10.0k
        - generic [ref=e380]:
          - generic [ref=e381]:
            - heading "Trending Now" [level=2] [ref=e384]
            - link "See All" [ref=e385] [cursor=pointer]:
              - /url: /categories
              - text: See All
              - img [ref=e386]
          - generic [ref=e388]:
            - link "image -6% NEW Add to wishlist shopping_bag Add to Cart Official Store iPhone 16 Pro Max star star star star star (1.2k) ৳159,999 ৳169,999 Save ৳10,000" [ref=e389] [cursor=pointer]:
              - /url: /product/prod_1
              - generic [ref=e390]:
                - generic [ref=e392]: image
                - generic [ref=e393]:
                  - generic [ref=e394]: "-6%"
                  - generic [ref=e395]: NEW
                - button "Add to wishlist" [ref=e396]:
                  - generic [ref=e397]: favorite
                - button "shopping_bag Add to Cart" [ref=e399]:
                  - generic [ref=e400]: shopping_bag
                  - text: Add to Cart
              - generic [ref=e401]:
                - generic [ref=e402]:
                  - img [ref=e403]
                  - generic [ref=e405]:
                    - img [ref=e406]
                    - text: Official Store
                - heading "iPhone 16 Pro Max" [level=3] [ref=e409]
                - generic [ref=e410]:
                  - generic [ref=e411]:
                    - generic [ref=e412]: star
                    - generic [ref=e413]: star
                    - generic [ref=e414]: star
                    - generic [ref=e415]: star
                    - generic [ref=e416]: star
                  - generic [ref=e417]: (1.2k)
                - generic [ref=e418]:
                  - generic [ref=e419]:
                    - generic [ref=e420]: ৳159,999
                    - generic [ref=e421]: ৳169,999
                  - paragraph [ref=e422]: Save ৳10,000
            - link "image -7% NEW Add to wishlist shopping_bag Add to Cart Official Store Samsung Galaxy S25 Ultra star star star star star (892) ৳139,999 ৳149,999 Save ৳10,000" [ref=e423] [cursor=pointer]:
              - /url: /product/prod_2
              - generic [ref=e424]:
                - generic [ref=e426]: image
                - generic [ref=e427]:
                  - generic [ref=e428]: "-7%"
                  - generic [ref=e429]: NEW
                - button "Add to wishlist" [ref=e430]:
                  - generic [ref=e431]: favorite
                - button "shopping_bag Add to Cart" [ref=e433]:
                  - generic [ref=e434]: shopping_bag
                  - text: Add to Cart
              - generic [ref=e435]:
                - generic [ref=e436]:
                  - img [ref=e437]
                  - generic [ref=e439]:
                    - img [ref=e440]
                    - text: Official Store
                - heading "Samsung Galaxy S25 Ultra" [level=3] [ref=e443]
                - generic [ref=e444]:
                  - generic [ref=e445]:
                    - generic [ref=e446]: star
                    - generic [ref=e447]: star
                    - generic [ref=e448]: star
                    - generic [ref=e449]: star
                    - generic [ref=e450]: star
                  - generic [ref=e451]: (892)
                - generic [ref=e452]:
                  - generic [ref=e453]:
                    - generic [ref=e454]: ৳139,999
                    - generic [ref=e455]: ৳149,999
                  - paragraph [ref=e456]: Save ৳10,000
            - link "image -6% NEW Add to wishlist shopping_bag Add to Cart Official Store MacBook Air M4 star star star star star (654) ৳145,000 ৳155,000 Save ৳10,000" [ref=e457] [cursor=pointer]:
              - /url: /product/prod_3
              - generic [ref=e458]:
                - generic [ref=e460]: image
                - generic [ref=e461]:
                  - generic [ref=e462]: "-6%"
                  - generic [ref=e463]: NEW
                - button "Add to wishlist" [ref=e464]:
                  - generic [ref=e465]: favorite
                - button "shopping_bag Add to Cart" [ref=e467]:
                  - generic [ref=e468]: shopping_bag
                  - text: Add to Cart
              - generic [ref=e469]:
                - generic [ref=e470]:
                  - img [ref=e471]
                  - generic [ref=e473]:
                    - img [ref=e474]
                    - text: Official Store
                - heading "MacBook Air M4" [level=3] [ref=e477]
                - generic [ref=e478]:
                  - generic [ref=e479]:
                    - generic [ref=e480]: star
                    - generic [ref=e481]: star
                    - generic [ref=e482]: star
                    - generic [ref=e483]: star
                    - generic [ref=e484]: star
                  - generic [ref=e485]: (654)
                - generic [ref=e486]:
                  - generic [ref=e487]:
                    - generic [ref=e488]: ৳145,000
                    - generic [ref=e489]: ৳155,000
                  - paragraph [ref=e490]: Save ৳10,000
            - link "image -12% NEW Add to wishlist shopping_bag Add to Cart Sony Sony WH-1000XM6 Headphones star star star star star (423) ৳35,000 ৳39,999 Save ৳4,999" [ref=e491] [cursor=pointer]:
              - /url: /product/prod_4
              - generic [ref=e492]:
                - generic [ref=e494]: image
                - generic [ref=e495]:
                  - generic [ref=e496]: "-12%"
                  - generic [ref=e497]: NEW
                - button "Add to wishlist" [ref=e498]:
                  - generic [ref=e499]: favorite
                - button "shopping_bag Add to Cart" [ref=e501]:
                  - generic [ref=e502]: shopping_bag
                  - text: Add to Cart
              - generic [ref=e503]:
                - paragraph [ref=e505]: Sony
                - heading "Sony WH-1000XM6 Headphones" [level=3] [ref=e506]
                - generic [ref=e507]:
                  - generic [ref=e508]:
                    - generic [ref=e509]: star
                    - generic [ref=e510]: star
                    - generic [ref=e511]: star
                    - generic [ref=e512]: star
                    - generic [ref=e513]: star
                  - generic [ref=e514]: (423)
                - generic [ref=e515]:
                  - generic [ref=e516]:
                    - generic [ref=e517]: ৳35,000
                    - generic [ref=e518]: ৳39,999
                  - paragraph [ref=e519]: Save ৳4,999
            - link "image -5% Add to wishlist shopping_bag Add to Cart Dell Dell XPS 16 Laptop star star star star star (234) ৳189,000 ৳199,000 Save ৳10,000" [ref=e520] [cursor=pointer]:
              - /url: /product/prod_5
              - generic [ref=e521]:
                - generic [ref=e523]: image
                - generic [ref=e525]: "-5%"
                - button "Add to wishlist" [ref=e526]:
                  - generic [ref=e527]: favorite
                - button "shopping_bag Add to Cart" [ref=e529]:
                  - generic [ref=e530]: shopping_bag
                  - text: Add to Cart
              - generic [ref=e531]:
                - paragraph [ref=e533]: Dell
                - heading "Dell XPS 16 Laptop" [level=3] [ref=e534]
                - generic [ref=e535]:
                  - generic [ref=e536]:
                    - generic [ref=e537]: star
                    - generic [ref=e538]: star
                    - generic [ref=e539]: star
                    - generic [ref=e540]: star
                    - generic [ref=e541]: star
                  - generic [ref=e542]: (234)
                - generic [ref=e543]:
                  - generic [ref=e544]:
                    - generic [ref=e545]: ৳189,000
                    - generic [ref=e546]: ৳199,000
                  - paragraph [ref=e547]: Save ৳10,000
            - link "image -14% NEW Add to wishlist shopping_bag Add to Cart Official Store Apple AirPods Pro 3 star star star star star (789) ৳29,999 ৳34,999 Save ৳5,000" [ref=e548] [cursor=pointer]:
              - /url: /product/prod_6
              - generic [ref=e549]:
                - generic [ref=e551]: image
                - generic [ref=e552]:
                  - generic [ref=e553]: "-14%"
                  - generic [ref=e554]: NEW
                - button "Add to wishlist" [ref=e555]:
                  - generic [ref=e556]: favorite
                - button "shopping_bag Add to Cart" [ref=e558]:
                  - generic [ref=e559]: shopping_bag
                  - text: Add to Cart
              - generic [ref=e560]:
                - generic [ref=e561]:
                  - img [ref=e562]
                  - generic [ref=e564]:
                    - img [ref=e565]
                    - text: Official Store
                - heading "Apple AirPods Pro 3" [level=3] [ref=e568]
                - generic [ref=e569]:
                  - generic [ref=e570]:
                    - generic [ref=e571]: star
                    - generic [ref=e572]: star
                    - generic [ref=e573]: star
                    - generic [ref=e574]: star
                    - generic [ref=e575]: star
                  - generic [ref=e576]: (789)
                - generic [ref=e577]:
                  - generic [ref=e578]:
                    - generic [ref=e579]: ৳29,999
                    - generic [ref=e580]: ৳34,999
                  - paragraph [ref=e581]: Save ৳5,000
            - link "image -10% NEW Add to wishlist shopping_bag Add to Cart Official Store Samsung Galaxy Watch 7 star star star star star (312) ৳45,000 ৳49,999 Save ৳4,999" [ref=e582] [cursor=pointer]:
              - /url: /product/prod_7
              - generic [ref=e583]:
                - generic [ref=e585]: image
                - generic [ref=e586]:
                  - generic [ref=e587]: "-10%"
                  - generic [ref=e588]: NEW
                - button "Add to wishlist" [ref=e589]:
                  - generic [ref=e590]: favorite
                - button "shopping_bag Add to Cart" [ref=e592]:
                  - generic [ref=e593]: shopping_bag
                  - text: Add to Cart
              - generic [ref=e594]:
                - generic [ref=e595]:
                  - img [ref=e596]
                  - generic [ref=e598]:
                    - img [ref=e599]
                    - text: Official Store
                - heading "Samsung Galaxy Watch 7" [level=3] [ref=e602]
                - generic [ref=e603]:
                  - generic [ref=e604]:
                    - generic [ref=e605]: star
                    - generic [ref=e606]: star
                    - generic [ref=e607]: star
                    - generic [ref=e608]: star
                    - generic [ref=e609]: star
                  - generic [ref=e610]: (312)
                - generic [ref=e611]:
                  - generic [ref=e612]:
                    - generic [ref=e613]: ৳45,000
                    - generic [ref=e614]: ৳49,999
                  - paragraph [ref=e615]: Save ৳4,999
        - generic [ref=e618]:
          - generic [ref=e619]:
            - generic [ref=e621]: verified
            - generic [ref=e622]:
              - heading "100% Authentic" [level=4] [ref=e624]
              - paragraph [ref=e625]: Genuine products with brand warranty on every purchase
              - generic [ref=e626]: Verified
          - generic [ref=e627]:
            - generic [ref=e629]: lock
            - generic [ref=e630]:
              - heading "Secure Payments" [level=4] [ref=e632]
              - paragraph [ref=e633]: SSL encrypted. bKash, Nagad, cards & COD accepted
              - generic [ref=e634]: SSL Secured
          - generic [ref=e635]:
            - generic [ref=e637]: local_shipping
            - generic [ref=e638]:
              - heading "Nationwide Delivery" [level=4] [ref=e640]
              - paragraph [ref=e641]: Free shipping on orders over ৳999 across Bangladesh
              - generic [ref=e642]: Free Shipping
          - generic [ref=e643]:
            - generic [ref=e645]: assignment_return
            - generic [ref=e646]:
              - heading "Easy Returns" [level=4] [ref=e648]
              - paragraph [ref=e649]: 7-day hassle-free return policy, no questions asked
              - generic [ref=e650]: 7-Day Policy
        - generic [ref=e653]:
          - generic [ref=e654]:
            - generic [ref=e655]:
              - heading "Top Brands" [level=2] [ref=e656]
              - generic [ref=e657]: Official Stores
            - link "View All chevron_right" [ref=e658] [cursor=pointer]:
              - /url: /categories
              - text: View All
              - generic [ref=e659]: chevron_right
          - generic [ref=e660]:
            - link "Samsung Electronics" [ref=e661] [cursor=pointer]:
              - /url: /brand/samsung
              - img [ref=e664]
              - generic [ref=e666]:
                - paragraph [ref=e667]: Samsung
                - paragraph [ref=e668]: Electronics
            - link "Apple Premium Tech" [ref=e669] [cursor=pointer]:
              - /url: /brand/apple
              - img [ref=e672]
              - generic [ref=e674]:
                - paragraph [ref=e675]: Apple
                - paragraph [ref=e676]: Premium Tech
            - link "Xiaomi Smart Devices" [ref=e677] [cursor=pointer]:
              - /url: /brand/xiaomi
              - img [ref=e680]
              - generic [ref=e697]:
                - paragraph [ref=e698]: Xiaomi
                - paragraph [ref=e699]: Smart Devices
            - link "Walton Local Brand" [ref=e700] [cursor=pointer]:
              - /url: /brand/walton
              - img [ref=e703]
              - generic [ref=e705]:
                - paragraph [ref=e706]: Walton
                - paragraph [ref=e707]: Local Brand
            - link "Asus Computing" [ref=e708] [cursor=pointer]:
              - /url: /brand/asus
              - img [ref=e711]
              - generic [ref=e713]:
                - paragraph [ref=e714]: Asus
                - paragraph [ref=e715]: Computing
            - link "Lenovo Laptops" [ref=e716] [cursor=pointer]:
              - /url: /brand/lenovo
              - img [ref=e719]
              - generic [ref=e721]:
                - paragraph [ref=e722]: Lenovo
                - paragraph [ref=e723]: Laptops
            - link "HP Printers & PCs" [ref=e724] [cursor=pointer]:
              - /url: /brand/hp
              - img [ref=e727]
              - generic [ref=e729]:
                - paragraph [ref=e730]: HP
                - paragraph [ref=e731]: Printers & PCs
            - link "Realme Smartphones" [ref=e732] [cursor=pointer]:
              - /url: /brand/realme
              - img [ref=e735]
              - generic [ref=e737]:
                - paragraph [ref=e738]: Realme
                - paragraph [ref=e739]: Smartphones
        - generic [ref=e746]:
          - generic [ref=e748]: storefront
          - generic [ref=e749]:
            - heading "Start Selling on AmarShop" [level=3] [ref=e750]
            - paragraph [ref=e751]: Reach millions of customers across Bangladesh. Zero listing fees.
            - generic [ref=e752]:
              - generic [ref=e753]:
                - generic [ref=e754]: 2M+
                - generic [ref=e755]: Customers
              - generic [ref=e756]:
                - generic [ref=e757]: 50k+
                - generic [ref=e758]: Sellers
              - generic [ref=e759]:
                - generic [ref=e760]: 0%
                - generic [ref=e761]: Listing Fee
          - link "Join Free" [ref=e762] [cursor=pointer]:
            - /url: /seller/dashboard
            - text: Join Free
            - img [ref=e763]
        - generic [ref=e766]:
          - generic [ref=e767]:
            - heading "Just For You" [level=2] [ref=e770]
            - link "See All" [ref=e771] [cursor=pointer]:
              - /url: /categories
              - text: See All
              - img [ref=e772]
          - generic [ref=e774]:
            - link "image -6% NEW Add to wishlist shopping_bag Add to Cart Official Store iPhone 16 Pro Max star star star star star (1.2k) ৳159,999 ৳169,999 Save ৳10,000" [ref=e775] [cursor=pointer]:
              - /url: /product/prod_1
              - generic [ref=e776]:
                - generic [ref=e778]: image
                - generic [ref=e779]:
                  - generic [ref=e780]: "-6%"
                  - generic [ref=e781]: NEW
                - button "Add to wishlist" [ref=e782]:
                  - generic [ref=e783]: favorite
                - button "shopping_bag Add to Cart" [ref=e785]:
                  - generic [ref=e786]: shopping_bag
                  - text: Add to Cart
              - generic [ref=e787]:
                - generic [ref=e788]:
                  - img [ref=e789]
                  - generic [ref=e791]:
                    - img [ref=e792]
                    - text: Official Store
                - heading "iPhone 16 Pro Max" [level=3] [ref=e795]
                - generic [ref=e796]:
                  - generic [ref=e797]:
                    - generic [ref=e798]: star
                    - generic [ref=e799]: star
                    - generic [ref=e800]: star
                    - generic [ref=e801]: star
                    - generic [ref=e802]: star
                  - generic [ref=e803]: (1.2k)
                - generic [ref=e804]:
                  - generic [ref=e805]:
                    - generic [ref=e806]: ৳159,999
                    - generic [ref=e807]: ৳169,999
                  - paragraph [ref=e808]: Save ৳10,000
            - link "image -7% NEW Add to wishlist shopping_bag Add to Cart Official Store Samsung Galaxy S25 Ultra star star star star star (892) ৳139,999 ৳149,999 Save ৳10,000" [ref=e809] [cursor=pointer]:
              - /url: /product/prod_2
              - generic [ref=e810]:
                - generic [ref=e812]: image
                - generic [ref=e813]:
                  - generic [ref=e814]: "-7%"
                  - generic [ref=e815]: NEW
                - button "Add to wishlist" [ref=e816]:
                  - generic [ref=e817]: favorite
                - button "shopping_bag Add to Cart" [ref=e819]:
                  - generic [ref=e820]: shopping_bag
                  - text: Add to Cart
              - generic [ref=e821]:
                - generic [ref=e822]:
                  - img [ref=e823]
                  - generic [ref=e825]:
                    - img [ref=e826]
                    - text: Official Store
                - heading "Samsung Galaxy S25 Ultra" [level=3] [ref=e829]
                - generic [ref=e830]:
                  - generic [ref=e831]:
                    - generic [ref=e832]: star
                    - generic [ref=e833]: star
                    - generic [ref=e834]: star
                    - generic [ref=e835]: star
                    - generic [ref=e836]: star
                  - generic [ref=e837]: (892)
                - generic [ref=e838]:
                  - generic [ref=e839]:
                    - generic [ref=e840]: ৳139,999
                    - generic [ref=e841]: ৳149,999
                  - paragraph [ref=e842]: Save ৳10,000
            - link "image -6% NEW Add to wishlist shopping_bag Add to Cart Official Store MacBook Air M4 star star star star star (654) ৳145,000 ৳155,000 Save ৳10,000" [ref=e843] [cursor=pointer]:
              - /url: /product/prod_3
              - generic [ref=e844]:
                - generic [ref=e846]: image
                - generic [ref=e847]:
                  - generic [ref=e848]: "-6%"
                  - generic [ref=e849]: NEW
                - button "Add to wishlist" [ref=e850]:
                  - generic [ref=e851]: favorite
                - button "shopping_bag Add to Cart" [ref=e853]:
                  - generic [ref=e854]: shopping_bag
                  - text: Add to Cart
              - generic [ref=e855]:
                - generic [ref=e856]:
                  - img [ref=e857]
                  - generic [ref=e859]:
                    - img [ref=e860]
                    - text: Official Store
                - heading "MacBook Air M4" [level=3] [ref=e863]
                - generic [ref=e864]:
                  - generic [ref=e865]:
                    - generic [ref=e866]: star
                    - generic [ref=e867]: star
                    - generic [ref=e868]: star
                    - generic [ref=e869]: star
                    - generic [ref=e870]: star
                  - generic [ref=e871]: (654)
                - generic [ref=e872]:
                  - generic [ref=e873]:
                    - generic [ref=e874]: ৳145,000
                    - generic [ref=e875]: ৳155,000
                  - paragraph [ref=e876]: Save ৳10,000
            - link "image -12% NEW Add to wishlist shopping_bag Add to Cart Sony Sony WH-1000XM6 Headphones star star star star star (423) ৳35,000 ৳39,999 Save ৳4,999" [ref=e877] [cursor=pointer]:
              - /url: /product/prod_4
              - generic [ref=e878]:
                - generic [ref=e880]: image
                - generic [ref=e881]:
                  - generic [ref=e882]: "-12%"
                  - generic [ref=e883]: NEW
                - button "Add to wishlist" [ref=e884]:
                  - generic [ref=e885]: favorite
                - button "shopping_bag Add to Cart" [ref=e887]:
                  - generic [ref=e888]: shopping_bag
                  - text: Add to Cart
              - generic [ref=e889]:
                - paragraph [ref=e891]: Sony
                - heading "Sony WH-1000XM6 Headphones" [level=3] [ref=e892]
                - generic [ref=e893]:
                  - generic [ref=e894]:
                    - generic [ref=e895]: star
                    - generic [ref=e896]: star
                    - generic [ref=e897]: star
                    - generic [ref=e898]: star
                    - generic [ref=e899]: star
                  - generic [ref=e900]: (423)
                - generic [ref=e901]:
                  - generic [ref=e902]:
                    - generic [ref=e903]: ৳35,000
                    - generic [ref=e904]: ৳39,999
                  - paragraph [ref=e905]: Save ৳4,999
            - link "image -5% Add to wishlist shopping_bag Add to Cart Dell Dell XPS 16 Laptop star star star star star (234) ৳189,000 ৳199,000 Save ৳10,000" [ref=e906] [cursor=pointer]:
              - /url: /product/prod_5
              - generic [ref=e907]:
                - generic [ref=e909]: image
                - generic [ref=e911]: "-5%"
                - button "Add to wishlist" [ref=e912]:
                  - generic [ref=e913]: favorite
                - button "shopping_bag Add to Cart" [ref=e915]:
                  - generic [ref=e916]: shopping_bag
                  - text: Add to Cart
              - generic [ref=e917]:
                - paragraph [ref=e919]: Dell
                - heading "Dell XPS 16 Laptop" [level=3] [ref=e920]
                - generic [ref=e921]:
                  - generic [ref=e922]:
                    - generic [ref=e923]: star
                    - generic [ref=e924]: star
                    - generic [ref=e925]: star
                    - generic [ref=e926]: star
                    - generic [ref=e927]: star
                  - generic [ref=e928]: (234)
                - generic [ref=e929]:
                  - generic [ref=e930]:
                    - generic [ref=e931]: ৳189,000
                    - generic [ref=e932]: ৳199,000
                  - paragraph [ref=e933]: Save ৳10,000
            - link "image -14% NEW Add to wishlist shopping_bag Add to Cart Official Store Apple AirPods Pro 3 star star star star star (789) ৳29,999 ৳34,999 Save ৳5,000" [ref=e934] [cursor=pointer]:
              - /url: /product/prod_6
              - generic [ref=e935]:
                - generic [ref=e937]: image
                - generic [ref=e938]:
                  - generic [ref=e939]: "-14%"
                  - generic [ref=e940]: NEW
                - button "Add to wishlist" [ref=e941]:
                  - generic [ref=e942]: favorite
                - button "shopping_bag Add to Cart" [ref=e944]:
                  - generic [ref=e945]: shopping_bag
                  - text: Add to Cart
              - generic [ref=e946]:
                - generic [ref=e947]:
                  - img [ref=e948]
                  - generic [ref=e950]:
                    - img [ref=e951]
                    - text: Official Store
                - heading "Apple AirPods Pro 3" [level=3] [ref=e954]
                - generic [ref=e955]:
                  - generic [ref=e956]:
                    - generic [ref=e957]: star
                    - generic [ref=e958]: star
                    - generic [ref=e959]: star
                    - generic [ref=e960]: star
                    - generic [ref=e961]: star
                  - generic [ref=e962]: (789)
                - generic [ref=e963]:
                  - generic [ref=e964]:
                    - generic [ref=e965]: ৳29,999
                    - generic [ref=e966]: ৳34,999
                  - paragraph [ref=e967]: Save ৳5,000
            - link "image -10% NEW Add to wishlist shopping_bag Add to Cart Official Store Samsung Galaxy Watch 7 star star star star star (312) ৳45,000 ৳49,999 Save ৳4,999" [ref=e968] [cursor=pointer]:
              - /url: /product/prod_7
              - generic [ref=e969]:
                - generic [ref=e971]: image
                - generic [ref=e972]:
                  - generic [ref=e973]: "-10%"
                  - generic [ref=e974]: NEW
                - button "Add to wishlist" [ref=e975]:
                  - generic [ref=e976]: favorite
                - button "shopping_bag Add to Cart" [ref=e978]:
                  - generic [ref=e979]: shopping_bag
                  - text: Add to Cart
              - generic [ref=e980]:
                - generic [ref=e981]:
                  - img [ref=e982]
                  - generic [ref=e984]:
                    - img [ref=e985]
                    - text: Official Store
                - heading "Samsung Galaxy Watch 7" [level=3] [ref=e988]
                - generic [ref=e989]:
                  - generic [ref=e990]:
                    - generic [ref=e991]: star
                    - generic [ref=e992]: star
                    - generic [ref=e993]: star
                    - generic [ref=e994]: star
                    - generic [ref=e995]: star
                  - generic [ref=e996]: (312)
                - generic [ref=e997]:
                  - generic [ref=e998]:
                    - generic [ref=e999]: ৳45,000
                    - generic [ref=e1000]: ৳49,999
                  - paragraph [ref=e1001]: Save ৳4,999
            - link "image -13% Add to wishlist shopping_bag Add to Cart Logitech Logitech MX Master 4 Mouse star star star star star (156) ৳12,999 ৳14,999 Save ৳2,000" [ref=e1002] [cursor=pointer]:
              - /url: /product/prod_8
              - generic [ref=e1003]:
                - generic [ref=e1005]: image
                - generic [ref=e1007]: "-13%"
                - button "Add to wishlist" [ref=e1008]:
                  - generic [ref=e1009]: favorite
                - button "shopping_bag Add to Cart" [ref=e1011]:
                  - generic [ref=e1012]: shopping_bag
                  - text: Add to Cart
              - generic [ref=e1013]:
                - paragraph [ref=e1015]: Logitech
                - heading "Logitech MX Master 4 Mouse" [level=3] [ref=e1016]
                - generic [ref=e1017]:
                  - generic [ref=e1018]:
                    - generic [ref=e1019]: star
                    - generic [ref=e1020]: star
                    - generic [ref=e1021]: star
                    - generic [ref=e1022]: star
                    - generic [ref=e1023]: star
                  - generic [ref=e1024]: (156)
                - generic [ref=e1025]:
                  - generic [ref=e1026]:
                    - generic [ref=e1027]: ৳12,999
                    - generic [ref=e1028]: ৳14,999
                  - paragraph [ref=e1029]: Save ৳2,000
            - link "image -14% Add to wishlist shopping_bag Add to Cart Anker Anker PowerCore 26800 Portable Charger star star star star star (2.3k) ৳5,999 ৳6,999 Save ৳1,000" [ref=e1030] [cursor=pointer]:
              - /url: /product/prod_9
              - generic [ref=e1031]:
                - generic [ref=e1033]: image
                - generic [ref=e1035]: "-14%"
                - button "Add to wishlist" [ref=e1036]:
                  - generic [ref=e1037]: favorite
                - button "shopping_bag Add to Cart" [ref=e1039]:
                  - generic [ref=e1040]: shopping_bag
                  - text: Add to Cart
              - generic [ref=e1041]:
                - paragraph [ref=e1043]: Anker
                - heading "Anker PowerCore 26800 Portable Charger" [level=3] [ref=e1044]
                - generic [ref=e1045]:
                  - generic [ref=e1046]:
                    - generic [ref=e1047]: star
                    - generic [ref=e1048]: star
                    - generic [ref=e1049]: star
                    - generic [ref=e1050]: star
                    - generic [ref=e1051]: star
                  - generic [ref=e1052]: (2.3k)
                - generic [ref=e1053]:
                  - generic [ref=e1054]:
                    - generic [ref=e1055]: ৳5,999
                    - generic [ref=e1056]: ৳6,999
                  - paragraph [ref=e1057]: Save ৳1,000
            - link "image -11% NEW Add to wishlist shopping_bag Add to Cart JBL JBL Flip 7 Bluetooth Speaker star star star star star (445) ৳15,999 ৳17,999 Save ৳2,000" [ref=e1058] [cursor=pointer]:
              - /url: /product/prod_10
              - generic [ref=e1059]:
                - generic [ref=e1061]: image
                - generic [ref=e1062]:
                  - generic [ref=e1063]: "-11%"
                  - generic [ref=e1064]: NEW
                - button "Add to wishlist" [ref=e1065]:
                  - generic [ref=e1066]: favorite
                - button "shopping_bag Add to Cart" [ref=e1068]:
                  - generic [ref=e1069]: shopping_bag
                  - text: Add to Cart
              - generic [ref=e1070]:
                - paragraph [ref=e1072]: JBL
                - heading "JBL Flip 7 Bluetooth Speaker" [level=3] [ref=e1073]
                - generic [ref=e1074]:
                  - generic [ref=e1075]:
                    - generic [ref=e1076]: star
                    - generic [ref=e1077]: star
                    - generic [ref=e1078]: star
                    - generic [ref=e1079]: star
                    - generic [ref=e1080]: star
                  - generic [ref=e1081]: (445)
                - generic [ref=e1082]:
                  - generic [ref=e1083]:
                    - generic [ref=e1084]: ৳15,999
                    - generic [ref=e1085]: ৳17,999
                  - paragraph [ref=e1086]: Save ৳2,000
            - link "Nike Air Max 270 Shoes -17% Add to wishlist shopping_bag Add to Cart Official Store Nike Air Max 270 Shoes star star star star star (892) ৳12,500 ৳15,000 Save ৳2,500" [ref=e1087] [cursor=pointer]:
              - /url: /product/prod_11
              - generic [ref=e1088]:
                - img "Nike Air Max 270 Shoes" [ref=e1089]
                - generic [ref=e1091]: "-17%"
                - button "Add to wishlist" [ref=e1092]:
                  - generic [ref=e1093]: favorite
                - button "shopping_bag Add to Cart" [ref=e1095]:
                  - generic [ref=e1096]: shopping_bag
                  - text: Add to Cart
              - generic [ref=e1097]:
                - generic [ref=e1098]:
                  - img [ref=e1099]
                  - generic [ref=e1101]:
                    - img [ref=e1102]
                    - text: Official Store
                - heading "Nike Air Max 270 Shoes" [level=3] [ref=e1105]
                - generic [ref=e1106]:
                  - generic [ref=e1107]:
                    - generic [ref=e1108]: star
                    - generic [ref=e1109]: star
                    - generic [ref=e1110]: star
                    - generic [ref=e1111]: star
                    - generic [ref=e1112]: star
                  - generic [ref=e1113]: (892)
                - generic [ref=e1114]:
                  - generic [ref=e1115]:
                    - generic [ref=e1116]: ৳12,500
                    - generic [ref=e1117]: ৳15,000
                  - paragraph [ref=e1118]: Save ৳2,500
            - link "Adidas Ultraboost 22 Running Shoes -15% Add to wishlist shopping_bag Add to Cart Official Store Adidas Ultraboost 22 Running Shoes star star star star star (567) ৳14,500 ৳17,000 Save ৳2,500" [ref=e1119] [cursor=pointer]:
              - /url: /product/prod_12
              - generic [ref=e1120]:
                - img "Adidas Ultraboost 22 Running Shoes" [ref=e1121]
                - generic [ref=e1123]: "-15%"
                - button "Add to wishlist" [ref=e1124]:
                  - generic [ref=e1125]: favorite
                - button "shopping_bag Add to Cart" [ref=e1127]:
                  - generic [ref=e1128]: shopping_bag
                  - text: Add to Cart
              - generic [ref=e1129]:
                - generic [ref=e1130]:
                  - img [ref=e1131]
                  - generic [ref=e1133]:
                    - img [ref=e1134]
                    - text: Official Store
                - heading "Adidas Ultraboost 22 Running Shoes" [level=3] [ref=e1137]
                - generic [ref=e1138]:
                  - generic [ref=e1139]:
                    - generic [ref=e1140]: star
                    - generic [ref=e1141]: star
                    - generic [ref=e1142]: star
                    - generic [ref=e1143]: star
                    - generic [ref=e1144]: star
                  - generic [ref=e1145]: (567)
                - generic [ref=e1146]:
                  - generic [ref=e1147]:
                    - generic [ref=e1148]: ৳14,500
                    - generic [ref=e1149]: ৳17,000
                  - paragraph [ref=e1150]: Save ৳2,500
    - contentinfo [ref=e1151]:
      - generic [ref=e1157]:
        - generic [ref=e1158]:
          - img [ref=e1160]
          - generic [ref=e1163]:
            - heading "Stay in the Loop" [level=3] [ref=e1164]
            - paragraph [ref=e1165]: Exclusive deals, launches & offers — straight to your inbox.
        - generic [ref=e1166]:
          - generic [ref=e1167]:
            - img [ref=e1168]
            - textbox "Your email address" [ref=e1171]
          - button "Subscribe" [ref=e1172]:
            - text: Subscribe
            - img [ref=e1173]
      - generic [ref=e1175]:
        - generic [ref=e1176]:
          - generic [ref=e1177]:
            - link "AmarShop" [ref=e1178] [cursor=pointer]:
              - /url: /
              - img "AmarShop" [ref=e1179]
            - paragraph [ref=e1180]: Bangladesh's premium online marketplace. Shop millions of products from trusted sellers with fast delivery and the best deals.
            - generic [ref=e1181]:
              - heading "Follow Us" [level=4] [ref=e1182]
              - generic [ref=e1183]:
                - link "Facebook" [ref=e1184] [cursor=pointer]:
                  - /url: "#"
                  - img [ref=e1185]
                - link "Instagram" [ref=e1187] [cursor=pointer]:
                  - /url: "#"
                  - img [ref=e1188]
                - link "X (Twitter)" [ref=e1190] [cursor=pointer]:
                  - /url: "#"
                  - img [ref=e1191]
                - link "YouTube" [ref=e1193] [cursor=pointer]:
                  - /url: "#"
                  - img [ref=e1194]
                - link "LinkedIn" [ref=e1196] [cursor=pointer]:
                  - /url: https://www.linkedin.com/in/md-shawon-molla-2a3877293/
                  - img [ref=e1197]
                - link "GitHub" [ref=e1199] [cursor=pointer]:
                  - /url: https://github.com/shawon2210
                  - img [ref=e1200]
          - generic [ref=e1202]:
            - generic [ref=e1203]:
              - heading "Customer Service" [level=3] [ref=e1204]
              - list [ref=e1205]:
                - listitem [ref=e1206]:
                  - link "Help Center" [ref=e1207] [cursor=pointer]:
                    - /url: /help
                - listitem [ref=e1208]:
                  - link "Returns & Refunds" [ref=e1209] [cursor=pointer]:
                    - /url: /help/returns
                - listitem [ref=e1210]:
                  - link "Shipping Info" [ref=e1211] [cursor=pointer]:
                    - /url: /help/shipping
                - listitem [ref=e1212]:
                  - link "Order Tracking" [ref=e1213] [cursor=pointer]:
                    - /url: /orders
                - listitem [ref=e1214]:
                  - link "Payment Methods" [ref=e1215] [cursor=pointer]:
                    - /url: /help/payment
                - listitem [ref=e1216]:
                  - link "Contact Us" [ref=e1217] [cursor=pointer]:
                    - /url: /contact
            - generic [ref=e1218]:
              - heading "Shop Categories" [level=3] [ref=e1219]
              - list [ref=e1220]:
                - listitem [ref=e1221]:
                  - link "Electronics" [ref=e1222] [cursor=pointer]:
                    - /url: /category/electronics
                - listitem [ref=e1223]:
                  - link "Fashion" [ref=e1224] [cursor=pointer]:
                    - /url: /category/fashion
                - listitem [ref=e1225]:
                  - link "Beauty" [ref=e1226] [cursor=pointer]:
                    - /url: /category/beauty
                - listitem [ref=e1227]:
                  - link "Groceries" [ref=e1228] [cursor=pointer]:
                    - /url: /category/groceries
                - listitem [ref=e1229]:
                  - link "Home & Living" [ref=e1230] [cursor=pointer]:
                    - /url: /category/home
                - listitem [ref=e1231]:
                  - link "Sports" [ref=e1232] [cursor=pointer]:
                    - /url: /category/sports
            - generic [ref=e1233]:
              - heading "Seller Center" [level=3] [ref=e1234]
              - list [ref=e1235]:
                - listitem [ref=e1236]:
                  - link "Become a Seller" [ref=e1237] [cursor=pointer]:
                    - /url: /seller/dashboard
                - listitem [ref=e1238]:
                  - link "Seller Dashboard" [ref=e1239] [cursor=pointer]:
                    - /url: /seller/dashboard
                - listitem [ref=e1240]:
                  - link "Seller Analytics" [ref=e1241] [cursor=pointer]:
                    - /url: /seller/analytics
                - listitem [ref=e1242]:
                  - link "Seller Finance" [ref=e1243] [cursor=pointer]:
                    - /url: /seller/finance
                - listitem [ref=e1244]:
                  - link "Seller Policy" [ref=e1245] [cursor=pointer]:
                    - /url: /seller/policy
                - listitem [ref=e1246]:
                  - link "Seller Support" [ref=e1247] [cursor=pointer]:
                    - /url: /support/chat
            - generic [ref=e1248]:
              - heading "Company" [level=3] [ref=e1249]
              - list [ref=e1250]:
                - listitem [ref=e1251]:
                  - link "About Us" [ref=e1252] [cursor=pointer]:
                    - /url: /about
                - listitem [ref=e1253]:
                  - link "Careers" [ref=e1254] [cursor=pointer]:
                    - /url: /careers
                - listitem [ref=e1255]:
                  - link "Press & Media" [ref=e1256] [cursor=pointer]:
                    - /url: /press
                - listitem [ref=e1257]:
                  - link "Blog" [ref=e1258] [cursor=pointer]:
                    - /url: /blog
                - listitem [ref=e1259]:
                  - link "Terms of Service" [ref=e1260] [cursor=pointer]:
                    - /url: /terms
                - listitem [ref=e1261]:
                  - link "Privacy Policy" [ref=e1262] [cursor=pointer]:
                    - /url: /privacy
        - generic [ref=e1264]:
          - generic [ref=e1265]:
            - heading "Download App" [level=4] [ref=e1266]
            - generic [ref=e1268]:
              - link "Download on Google Play" [ref=e1269] [cursor=pointer]:
                - /url: "#"
                - img [ref=e1271]
                - generic [ref=e1273]:
                  - paragraph [ref=e1274]: Download on
                  - paragraph [ref=e1275]: Google Play
              - link "Download on App Store" [ref=e1276] [cursor=pointer]:
                - /url: "#"
                - img [ref=e1278]
                - generic [ref=e1280]:
                  - paragraph [ref=e1281]: Download on
                  - paragraph [ref=e1282]: App Store
          - generic [ref=e1283]:
            - heading "Accepted Payments" [level=4] [ref=e1284]
            - generic [ref=e1286]:
              - generic "bKash" [ref=e1287]:
                - img [ref=e1288]:
                  - generic [ref=e1290]: bKash
              - generic "Nagad" [ref=e1291]:
                - img [ref=e1292]:
                  - generic [ref=e1294]: Nagad
              - generic "Rocket" [ref=e1295]:
                - img [ref=e1296]:
                  - generic [ref=e1298]: Rocket
              - generic "Visa" [ref=e1299]:
                - img [ref=e1300]:
                  - generic [ref=e1302]: VISA
              - generic "Mastercard" [ref=e1303]:
                - img [ref=e1304]
              - generic "American Express" [ref=e1308]:
                - img [ref=e1309]:
                  - generic [ref=e1311]: AMEX
              - generic "PayPal" [ref=e1312]:
                - img [ref=e1313]:
                  - generic [ref=e1315]: PayPal
              - generic "COD" [ref=e1316]:
                - img [ref=e1317]:
                  - generic [ref=e1319]: COD
          - generic [ref=e1321]:
            - heading "Delivery Partners" [level=4] [ref=e1322]
            - generic [ref=e1323]:
              - generic [ref=e1324]: Pathao
              - generic [ref=e1325]: RedX
              - generic [ref=e1326]: Steadfast
              - generic [ref=e1327]: Sundarban
              - generic [ref=e1328]: Paperfly
        - generic [ref=e1330]:
          - generic [ref=e1331]:
            - img [ref=e1332]
            - text: 100% Secure Payment
          - paragraph [ref=e1335]: © 2026 AmarShop. All rights reserved.
          - generic [ref=e1336]:
            - link "Privacy" [ref=e1337] [cursor=pointer]:
              - /url: /privacy
            - link "Terms" [ref=e1338] [cursor=pointer]:
              - /url: /terms
            - link "Support" [ref=e1339] [cursor=pointer]:
              - /url: /support/chat
            - link "Track Order" [ref=e1340] [cursor=pointer]:
              - /url: /orders
  - generic [ref=e1345] [cursor=pointer]:
    - button "Open Next.js Dev Tools" [ref=e1346]:
      - img [ref=e1347]
    - generic [ref=e1350]:
      - button "Open issues overlay" [ref=e1351]:
        - generic [ref=e1352]:
          - generic [ref=e1353]: "0"
          - generic [ref=e1354]: "1"
        - generic [ref=e1355]: Issue
      - button "Collapse issues badge" [ref=e1356]:
        - img [ref=e1357]
  - alert [ref=e1359]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import { createHmac } from 'node:crypto';
  3   | 
  4   | const JWT_SECRET = '9fb486a6007e90c5c176e0a92659c2b267a4bd08a11b436b410dee539a548752';
  5   | 
  6   | function generateToken(payload: Record<string, string>): string {
  7   |   const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  8   |   const now = Math.floor(Date.now() / 1000);
  9   |   const claims = Buffer.from(JSON.stringify({ ...payload, iat: now, exp: now + 900 })).toString('base64url');
  10  |   const signature = createHmac('sha256', JWT_SECRET)
  11  |     .update(`${header}.${claims}`)
  12  |     .digest('base64url');
  13  |   return `${header}.${claims}.${signature}`;
  14  | }
  15  | 
  16  | const demoUser = {
  17  |   id: 'demo-customer',
  18  |   name: 'Demo Customer',
  19  |   email: 'customer@amarshop.com',
  20  |   phone: '01700000000',
  21  |   role: 'CUSTOMER' as const,
  22  |   isSeller: false,
  23  | };
  24  | 
  25  | const cartItem = {
  26  |   id: 'cart-test-1',
  27  |   quantity: 2,
  28  |   selected: true,
  29  |   sellerName: 'Test Store',
  30  |   sellerId: 'seller-1',
  31  |   product: {
  32  |     id: 'prod-1',
  33  |     name: 'Test Product',
  34  |     slug: 'test-product',
  35  |     description: 'A test product',
  36  |     price: 999,
  37  |     originalPrice: 1299,
  38  |     discount: 23,
  39  |     currency: 'BDT',
  40  |     images: ['/placeholder.png'],
  41  |     category: 'Electronics',
  42  |     categoryId: 'cat-1',
  43  |     rating: 4.5,
  44  |     reviewCount: 10,
  45  |     inStock: true,
  46  |     stockCount: 50,
  47  |     createdAt: '2024-01-01T00:00:00.000Z',
  48  |   },
  49  | };
  50  | 
  51  | async function setupAuth(page: import('@playwright/test').Page, withItems?: boolean) {
  52  |   const token = generateToken({ sub: demoUser.id, role: demoUser.role, phone: demoUser.phone });
  53  | 
> 54  |   await page.goto('/');
      |              ^ Error: page.goto: Test timeout of 30000ms exceeded.
  55  |   await page.evaluate(({ auth, cart }) => {
  56  |     localStorage.setItem('amarshop-auth', JSON.stringify(auth));
  57  |     localStorage.setItem('amarshop-cart', JSON.stringify(cart));
  58  |   }, {
  59  |     auth: { state: { accessToken: token, refreshToken: 'demo-refresh', user: demoUser }, version: 0 },
  60  |     cart: {
  61  |       state: { items: withItems ? [cartItem] : [], couponCode: '', couponDiscount: 0 },
  62  |       version: 0,
  63  |     },
  64  |   });
  65  |   await page.context().addCookies([
  66  |     { name: 'accessToken', value: token, path: '/', domain: 'localhost' },
  67  |   ]);
  68  | }
  69  | 
  70  | test.describe('Cart page - empty cart', () => {
  71  |   test.beforeEach(async ({ page }) => {
  72  |     await setupAuth(page, false);
  73  |     await page.goto('/cart');
  74  |     await page.waitForLoadState('load');
  75  |   });
  76  | 
  77  |   test('shows Your Cart is Empty heading', async ({ page }) => {
  78  |     await expect(page.getByText('Your Cart is Empty')).toBeVisible();
  79  |   });
  80  | });
  81  | 
  82  | test.describe('Cart page layout & bottom bar', () => {
  83  |   test.beforeEach(async ({ page }) => {
  84  |     await setupAuth(page, true);
  85  |     await page.goto('/cart');
  86  |     await page.waitForLoadState('load');
  87  |   });
  88  | 
  89  |   test('desktop shows Order Summary sidebar on lg+', async ({ page }) => {
  90  |     await page.setViewportSize({ width: 1280, height: 800 });
  91  |     await page.goto('/cart');
  92  |     await page.waitForLoadState('load');
  93  | 
  94  |     const summary = page.locator('.hidden.lg\\:block').filter({ hasText: 'Order Summary' });
  95  |     await expect(summary).toBeVisible();
  96  |   });
  97  | 
  98  |   test('mobile hides Order Summary sidebar', async ({ page }) => {
  99  |     await page.setViewportSize({ width: 375, height: 667 });
  100 |     await page.goto('/cart');
  101 | 
  102 |     const summary = page.locator('.hidden.lg\\:block').filter({ hasText: 'Order Summary' });
  103 |     await expect(summary).not.toBeVisible();
  104 |   });
  105 | 
  106 |   test('uses lg:grid layout for desktop columns', async ({ page }) => {
  107 |     await page.setViewportSize({ width: 1280, height: 800 });
  108 |     await page.goto('/cart');
  109 |     await page.waitForLoadState('load');
  110 | 
  111 |     const layout = page.locator('.lg\\:grid');
  112 |     await expect(layout).toHaveClass(/lg:grid-cols-\[minmax\(0\,2fr\)_minmax\(0\,1fr\)\]/);
  113 |   });
  114 | 
  115 |   test('bottom padding switches at lg breakpoint', async ({ page }) => {
  116 |     await page.setViewportSize({ width: 375, height: 667 });
  117 |     await page.goto('/cart');
  118 |     const cartPage = page.locator('.app-container.pt-4');
  119 |     await expect(cartPage).toHaveClass(/pb-\[calc/);
  120 | 
  121 |     await page.setViewportSize({ width: 1280, height: 800 });
  122 |     await page.goto('/cart');
  123 |     await expect(cartPage).toHaveClass(/lg:pb-12/);
  124 |   });
  125 | });
  126 | 
```
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: search-overlay.spec.ts >> Search overlay - focus trapping and Esc close >> closes when clicking backdrop outside the panel
- Location: e2e\search-overlay.spec.ts:44:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('header button:has-text("Search products")')
    - locator resolved to <button class="relative w-full max-w-580px lg:max-w-700px group">…</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not visible
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not visible
    - retrying click action
      - waiting 100ms
    35 × waiting for element to be visible, enabled and stable
       - element is not visible
     - retrying click action
       - waiting 500ms

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
          - button "Open menu" [ref=e8]:
            - generic [ref=e9]: menu
          - link "AmarShop" [ref=e10] [cursor=pointer]:
            - /url: /
            - img "AmarShop" [ref=e11]
        - generic [ref=e12]:
          - button "Search" [ref=e13]:
            - generic [ref=e14]: search
          - link "Shopping cart" [ref=e15] [cursor=pointer]:
            - /url: /cart
            - generic [ref=e16]: shopping_cart
    - main [ref=e17]:
      - generic [ref=e18]:
        - generic [ref=e20]:
          - generic [ref=e21]:
            - generic [ref=e23]:
              - generic [ref=e27]:
                - generic [ref=e28]: Flash Sale
                - heading [level=2] [ref=e29]: Shop Smart, Live Better
                - paragraph [ref=e30]: Fast delivery across Bangladesh.
                - link [ref=e31] [cursor=pointer]:
                  - /url: /categories
                  - text: Shop Now
                  - img [ref=e32]
              - generic [ref=e37]:
                - generic [ref=e38]: Eid Specials
                - heading "Huge Savings Await" [level=2] [ref=e39]
                - paragraph [ref=e40]: Up to 50% off fashion & electronics.
                - link "Explore Deals" [ref=e41] [cursor=pointer]:
                  - /url: /flash-sale
                  - text: Explore Deals
                  - img [ref=e42]
              - generic [ref=e47]:
                - generic [ref=e48]: Summer Sale
                - heading [level=2] [ref=e49]: Up to 70% Off
                - paragraph [ref=e50]: Limited time. Free shipping included.
                - link [ref=e51] [cursor=pointer]:
                  - /url: /flash-sale
                  - text: Shop Now
                  - img [ref=e52]
              - generic [ref=e57]:
                - generic [ref=e58]: Tech Fest
                - heading [level=2] [ref=e59]: Latest Gadgets
                - paragraph [ref=e60]: Free shipping on all tech.
                - link [ref=e61] [cursor=pointer]:
                  - /url: /category/electronics
                  - text: Explore
                  - img [ref=e62]
              - button "Previous slide" [ref=e64]:
                - img [ref=e65]
              - button "Next slide" [ref=e67]:
                - img [ref=e68]
              - generic [ref=e70]:
                - button "Slide 1" [ref=e71]
                - button "Slide 2" [ref=e72]
                - button "Slide 3" [ref=e74]
                - button "Slide 4" [ref=e75]
              - generic [ref=e76]: 02 / 04
            - generic [ref=e77]:
              - link "flash_on Flash Sale Up to 70% off today" [ref=e78] [cursor=pointer]:
                - /url: /flash-sale
                - generic [ref=e80]: flash_on
                - generic [ref=e81]:
                  - paragraph [ref=e82]: Flash Sale
                  - paragraph [ref=e83]: Up to 70% off today
              - link "local_shipping Free Delivery On orders over ৳999" [ref=e84] [cursor=pointer]:
                - /url: "#"
                - generic [ref=e86]: local_shipping
                - generic [ref=e87]:
                  - paragraph [ref=e88]: Free Delivery
                  - paragraph [ref=e89]: On orders over ৳999
              - link "new_releases New Arrivals Fresh styles every day" [ref=e90] [cursor=pointer]:
                - /url: /categories
                - generic [ref=e92]: new_releases
                - generic [ref=e93]:
                  - paragraph [ref=e94]: New Arrivals
                  - paragraph [ref=e95]: Fresh styles every day
              - link "storefront Sell on AmarShop Zero listing fees" [ref=e96] [cursor=pointer]:
                - /url: /seller/dashboard
                - generic [ref=e98]: storefront
                - generic [ref=e99]:
                  - paragraph [ref=e100]: Sell on AmarShop
                  - paragraph [ref=e101]: Zero listing fees
          - generic [ref=e103]:
            - link "Electronics" [ref=e104] [cursor=pointer]:
              - /url: /categories
            - link "Fashion" [ref=e105] [cursor=pointer]:
              - /url: /categories
            - link "Beauty" [ref=e106] [cursor=pointer]:
              - /url: /categories
            - link "Groceries" [ref=e107] [cursor=pointer]:
              - /url: /categories
            - link "Home" [ref=e108] [cursor=pointer]:
              - /url: /categories
            - link "Sports" [ref=e109] [cursor=pointer]:
              - /url: /categories
            - link "🔥 Flash Sale" [ref=e110] [cursor=pointer]:
              - /url: /categories
            - link "New Arrivals" [ref=e111] [cursor=pointer]:
              - /url: /categories
        - generic [ref=e113]:
          - generic [ref=e114]:
            - img [ref=e115]
            - generic [ref=e117]: 4.8 Average Rating
          - generic [ref=e118]:
            - img [ref=e119]
            - generic [ref=e124]: Nationwide Delivery
          - generic [ref=e125]:
            - img [ref=e126]
            - generic [ref=e129]: Secure Payment
          - generic [ref=e130]:
            - img [ref=e131]
            - generic [ref=e134]: Easy Returns
          - generic [ref=e135]:
            - img [ref=e136]
            - generic [ref=e139]: Verified Sellers
          - generic [ref=e140]:
            - img [ref=e141]
            - generic [ref=e145]: Free Delivery
        - generic [ref=e152]:
          - generic [ref=e153]:
            - generic [ref=e154]:
              - heading "Flash Sale" [level=2] [ref=e159]
              - generic [ref=e160]:
                - generic [ref=e161]:
                  - generic [ref=e162]: "3868"
                  - generic [ref=e163]: hrs
                - generic [ref=e164]: ":"
                - generic [ref=e165]:
                  - generic [ref=e166]: "24"
                  - generic [ref=e167]: min
                - generic [ref=e168]: ":"
                - generic [ref=e169]:
                  - generic [ref=e170]: "54"
                  - generic [ref=e171]: sec
            - link "See All" [ref=e172] [cursor=pointer]:
              - /url: /flash-sale
              - text: See All
              - img [ref=e173]
          - generic [ref=e175]:
            - link "Samsung Galaxy S25 Ultra Flash Sale -20% Samsung Galaxy S25 Ultra Flash Sale ৳119,999 ৳149,999 72% sold 28% left Add to Cart" [ref=e176] [cursor=pointer]:
              - /url: /product/sale_1
              - generic [ref=e177]:
                - img "Samsung Galaxy S25 Ultra Flash Sale" [ref=e178]
                - generic [ref=e179]: "-20%"
              - generic [ref=e180]:
                - paragraph [ref=e181]: Samsung Galaxy S25 Ultra Flash Sale
                - generic [ref=e182]:
                  - generic [ref=e183]: ৳119,999
                  - generic [ref=e184]: ৳149,999
                - generic [ref=e186]:
                  - generic [ref=e187]: 72% sold
                  - generic [ref=e188]: 28% left
                - button "Add to Cart" [ref=e191]
            - link "Sony WH-1000XM6 Flash Deal -25% Sony WH-1000XM6 Flash Deal ৳29,999 ৳39,999 65% sold 35% left Add to Cart" [ref=e192] [cursor=pointer]:
              - /url: /product/sale_2
              - generic [ref=e193]:
                - img "Sony WH-1000XM6 Flash Deal" [ref=e194]
                - generic [ref=e195]: "-25%"
              - generic [ref=e196]:
                - paragraph [ref=e197]: Sony WH-1000XM6 Flash Deal
                - generic [ref=e198]:
                  - generic [ref=e199]: ৳29,999
                  - generic [ref=e200]: ৳39,999
                - generic [ref=e202]:
                  - generic [ref=e203]: 65% sold
                  - generic [ref=e204]: 35% left
                - button "Add to Cart" [ref=e207]
            - link "image -20% Apple AirPods Pro 3 Flash Sale ৳27,999 ৳34,999 78% sold 22% left Add to Cart" [ref=e208] [cursor=pointer]:
              - /url: /product/sale_3
              - generic [ref=e209]:
                - generic [ref=e211]: image
                - generic [ref=e212]: "-20%"
              - generic [ref=e213]:
                - paragraph [ref=e214]: Apple AirPods Pro 3 Flash Sale
                - generic [ref=e215]:
                  - generic [ref=e216]: ৳27,999
                  - generic [ref=e217]: ৳34,999
                - generic [ref=e219]:
                  - generic [ref=e220]: 78% sold
                  - generic [ref=e221]: 22% left
                - button "Add to Cart" [ref=e224]
            - link "MacBook Air M4 Flash Sale -17% MacBook Air M4 Flash Sale ৳129,000 ৳155,000 92% sold 8% left Add to Cart" [ref=e225] [cursor=pointer]:
              - /url: /product/sale_4
              - generic [ref=e226]:
                - img "MacBook Air M4 Flash Sale" [ref=e227]
                - generic [ref=e228]: "-17%"
              - generic [ref=e229]:
                - paragraph [ref=e230]: MacBook Air M4 Flash Sale
                - generic [ref=e231]:
                  - generic [ref=e232]: ৳129,000
                  - generic [ref=e233]: ৳155,000
                - generic [ref=e235]:
                  - generic [ref=e236]: 92% sold
                  - generic [ref=e237]: 8% left
                - button "Add to Cart" [ref=e240]
            - link "Dell XPS 16 Flash Deal -13% Dell XPS 16 Flash Deal ৳173,000 ৳199,000 45% sold 55% left Add to Cart" [ref=e241] [cursor=pointer]:
              - /url: /product/sale_5
              - generic [ref=e242]:
                - img "Dell XPS 16 Flash Deal" [ref=e243]
                - generic [ref=e244]: "-13%"
              - generic [ref=e245]:
                - paragraph [ref=e246]: Dell XPS 16 Flash Deal
                - generic [ref=e247]:
                  - generic [ref=e248]: ৳173,000
                  - generic [ref=e249]: ৳199,000
                - generic [ref=e251]:
                  - generic [ref=e252]: 45% sold
                  - generic [ref=e253]: 55% left
                - button "Add to Cart" [ref=e256]
            - link "Anker PowerCore Flash Sale -31% Anker PowerCore Flash Sale ৳4,799 ৳6,999 88% sold 12% left Add to Cart" [ref=e257] [cursor=pointer]:
              - /url: /product/sale_6
              - generic [ref=e258]:
                - img "Anker PowerCore Flash Sale" [ref=e259]
                - generic [ref=e260]: "-31%"
              - generic [ref=e261]:
                - paragraph [ref=e262]: Anker PowerCore Flash Sale
                - generic [ref=e263]:
                  - generic [ref=e264]: ৳4,799
                  - generic [ref=e265]: ৳6,999
                - generic [ref=e267]:
                  - generic [ref=e268]: 88% sold
                  - generic [ref=e269]: 12% left
                - button "Add to Cart" [ref=e272]
        - generic [ref=e275]:
          - generic [ref=e276]:
            - heading "Shop by Category" [level=2] [ref=e277]
            - link "View All chevron_right" [ref=e278] [cursor=pointer]:
              - /url: /categories
              - text: View All
              - generic [ref=e279]: chevron_right
          - generic [ref=e280]:
            - link "checkroom Fashion 12k+" [ref=e281] [cursor=pointer]:
              - /url: /category/fashion
              - generic [ref=e283]: checkroom
              - generic [ref=e284]:
                - paragraph [ref=e285]: Fashion
                - generic [ref=e286]: 12k+
            - link "devices Electronics 8.9k" [ref=e287] [cursor=pointer]:
              - /url: /category/electronics
              - generic [ref=e289]: devices
              - generic [ref=e290]:
                - paragraph [ref=e291]: Electronics
                - generic [ref=e292]: 8.9k
            - link "shopping_basket Groceries 15k+" [ref=e293] [cursor=pointer]:
              - /url: /category/groceries
              - generic [ref=e295]: shopping_basket
              - generic [ref=e296]:
                - paragraph [ref=e297]: Groceries
                - generic [ref=e298]: 15k+
            - link "chair Home & Living 6.8k" [ref=e299] [cursor=pointer]:
              - /url: /category/home
              - generic [ref=e301]: chair
              - generic [ref=e302]:
                - paragraph [ref=e303]: Home & Living
                - generic [ref=e304]: 6.8k
            - link "spa Beauty 4.5k" [ref=e305] [cursor=pointer]:
              - /url: /category/beauty
              - generic [ref=e307]: spa
              - generic [ref=e308]:
                - paragraph [ref=e309]: Beauty
                - generic [ref=e310]: 4.5k
            - link "sports_esports Toys & Games 3.2k" [ref=e311] [cursor=pointer]:
              - /url: /category/toys
              - generic [ref=e313]: sports_esports
              - generic [ref=e314]:
                - paragraph [ref=e315]: Toys & Games
                - generic [ref=e316]: 3.2k
            - link "fitness_center Sports 2.9k" [ref=e317] [cursor=pointer]:
              - /url: /category/sports
              - generic [ref=e319]: fitness_center
              - generic [ref=e320]:
                - paragraph [ref=e321]: Sports
                - generic [ref=e322]: 2.9k
            - link "stadia_controller Gaming 5.6k" [ref=e323] [cursor=pointer]:
              - /url: /category/gaming
              - generic [ref=e325]: stadia_controller
              - generic [ref=e326]:
                - paragraph [ref=e327]: Gaming
                - generic [ref=e328]: 5.6k
            - link "kitchen Appliances 4.3k" [ref=e329] [cursor=pointer]:
              - /url: /category/appliances
              - generic [ref=e331]: kitchen
              - generic [ref=e332]:
                - paragraph [ref=e333]: Appliances
                - generic [ref=e334]: 4.3k
            - link "menu_book Books 7.2k" [ref=e335] [cursor=pointer]:
              - /url: /category/books-stationery
              - generic [ref=e337]: menu_book
              - generic [ref=e338]:
                - paragraph [ref=e339]: Books
                - generic [ref=e340]: 7.2k
            - link "directions_car Automotive 2.1k" [ref=e341] [cursor=pointer]:
              - /url: /category/automotive
              - generic [ref=e343]: directions_car
              - generic [ref=e344]:
                - paragraph [ref=e345]: Automotive
                - generic [ref=e346]: 2.1k
            - link "grid_view More 10.0k" [ref=e347] [cursor=pointer]:
              - /url: /category/more
              - generic [ref=e349]: grid_view
              - generic [ref=e350]:
                - paragraph [ref=e351]: More
                - generic [ref=e352]: 10.0k
        - generic [ref=e354]:
          - generic [ref=e355]:
            - heading "Trending Now" [level=2] [ref=e358]
            - link "See All" [ref=e359] [cursor=pointer]:
              - /url: /categories
              - text: See All
              - img [ref=e360]
          - generic [ref=e362]:
            - link "iPhone 16 Pro Max -6% NEW Add to wishlist Official Store iPhone 16 Pro Max star star star star star (1.2k) ৳159,999 ৳169,999 Save ৳10,000 shopping_bag Add to Cart" [ref=e363] [cursor=pointer]:
              - /url: /product/prod_1
              - generic [ref=e364]:
                - img "iPhone 16 Pro Max" [ref=e365]
                - generic [ref=e366]:
                  - generic [ref=e367]: "-6%"
                  - generic [ref=e368]: NEW
                - button "Add to wishlist" [ref=e369]:
                  - generic [ref=e370]: favorite
              - generic [ref=e371]:
                - generic [ref=e372]:
                  - img [ref=e373]
                  - generic [ref=e375]:
                    - img [ref=e376]
                    - text: Official Store
                - heading "iPhone 16 Pro Max" [level=3] [ref=e379]
                - generic [ref=e380]:
                  - generic [ref=e381]:
                    - generic [ref=e382]: star
                    - generic [ref=e383]: star
                    - generic [ref=e384]: star
                    - generic [ref=e385]: star
                    - generic [ref=e386]: star
                  - generic [ref=e387]: (1.2k)
                - generic [ref=e388]:
                  - generic [ref=e389]:
                    - generic [ref=e390]: ৳159,999
                    - generic [ref=e391]: ৳169,999
                  - paragraph [ref=e392]: Save ৳10,000
                - button "shopping_bag Add to Cart" [ref=e393]:
                  - generic [ref=e394]: shopping_bag
                  - text: Add to Cart
            - link "Samsung Galaxy S25 Ultra -7% NEW Add to wishlist Official Store Samsung Galaxy S25 Ultra star star star star star (892) ৳139,999 ৳149,999 Save ৳10,000 shopping_bag Add to Cart" [ref=e395] [cursor=pointer]:
              - /url: /product/prod_2
              - generic [ref=e396]:
                - img "Samsung Galaxy S25 Ultra" [ref=e397]
                - generic [ref=e398]:
                  - generic [ref=e399]: "-7%"
                  - generic [ref=e400]: NEW
                - button "Add to wishlist" [ref=e401]:
                  - generic [ref=e402]: favorite
              - generic [ref=e403]:
                - generic [ref=e404]:
                  - img [ref=e405]
                  - generic [ref=e407]:
                    - img [ref=e408]
                    - text: Official Store
                - heading "Samsung Galaxy S25 Ultra" [level=3] [ref=e411]
                - generic [ref=e412]:
                  - generic [ref=e413]:
                    - generic [ref=e414]: star
                    - generic [ref=e415]: star
                    - generic [ref=e416]: star
                    - generic [ref=e417]: star
                    - generic [ref=e418]: star
                  - generic [ref=e419]: (892)
                - generic [ref=e420]:
                  - generic [ref=e421]:
                    - generic [ref=e422]: ৳139,999
                    - generic [ref=e423]: ৳149,999
                  - paragraph [ref=e424]: Save ৳10,000
                - button "shopping_bag Add to Cart" [ref=e425]:
                  - generic [ref=e426]: shopping_bag
                  - text: Add to Cart
            - link "image -6% NEW Add to wishlist Official Store MacBook Air M4 star star star star star (654) ৳145,000 ৳155,000 Save ৳10,000 shopping_bag Add to Cart" [ref=e427] [cursor=pointer]:
              - /url: /product/prod_3
              - generic [ref=e428]:
                - generic [ref=e430]: image
                - generic [ref=e431]:
                  - generic [ref=e432]: "-6%"
                  - generic [ref=e433]: NEW
                - button "Add to wishlist" [ref=e434]:
                  - generic [ref=e435]: favorite
              - generic [ref=e436]:
                - generic [ref=e437]:
                  - img [ref=e438]
                  - generic [ref=e440]:
                    - img [ref=e441]
                    - text: Official Store
                - heading "MacBook Air M4" [level=3] [ref=e444]
                - generic [ref=e445]:
                  - generic [ref=e446]:
                    - generic [ref=e447]: star
                    - generic [ref=e448]: star
                    - generic [ref=e449]: star
                    - generic [ref=e450]: star
                    - generic [ref=e451]: star
                  - generic [ref=e452]: (654)
                - generic [ref=e453]:
                  - generic [ref=e454]:
                    - generic [ref=e455]: ৳145,000
                    - generic [ref=e456]: ৳155,000
                  - paragraph [ref=e457]: Save ৳10,000
                - button "shopping_bag Add to Cart" [ref=e458]:
                  - generic [ref=e459]: shopping_bag
                  - text: Add to Cart
            - link "Sony WH-1000XM6 Headphones -12% NEW Add to wishlist Sony Sony WH-1000XM6 Headphones star star star star star (423) ৳35,000 ৳39,999 Save ৳4,999 shopping_bag Add to Cart" [ref=e460] [cursor=pointer]:
              - /url: /product/prod_4
              - generic [ref=e461]:
                - img "Sony WH-1000XM6 Headphones" [ref=e462]
                - generic [ref=e463]:
                  - generic [ref=e464]: "-12%"
                  - generic [ref=e465]: NEW
                - button "Add to wishlist" [ref=e466]:
                  - generic [ref=e467]: favorite
              - generic [ref=e468]:
                - paragraph [ref=e470]: Sony
                - heading "Sony WH-1000XM6 Headphones" [level=3] [ref=e471]
                - generic [ref=e472]:
                  - generic [ref=e473]:
                    - generic [ref=e474]: star
                    - generic [ref=e475]: star
                    - generic [ref=e476]: star
                    - generic [ref=e477]: star
                    - generic [ref=e478]: star
                  - generic [ref=e479]: (423)
                - generic [ref=e480]:
                  - generic [ref=e481]:
                    - generic [ref=e482]: ৳35,000
                    - generic [ref=e483]: ৳39,999
                  - paragraph [ref=e484]: Save ৳4,999
                - button "shopping_bag Add to Cart" [ref=e485]:
                  - generic [ref=e486]: shopping_bag
                  - text: Add to Cart
            - link "Dell XPS 16 Laptop -5% Add to wishlist Dell Dell XPS 16 Laptop star star star star star (234) ৳189,000 ৳199,000 Save ৳10,000 shopping_bag Add to Cart" [ref=e487] [cursor=pointer]:
              - /url: /product/prod_5
              - generic [ref=e488]:
                - img "Dell XPS 16 Laptop" [ref=e489]
                - generic [ref=e491]: "-5%"
                - button "Add to wishlist" [ref=e492]:
                  - generic [ref=e493]: favorite
              - generic [ref=e494]:
                - paragraph [ref=e496]: Dell
                - heading "Dell XPS 16 Laptop" [level=3] [ref=e497]
                - generic [ref=e498]:
                  - generic [ref=e499]:
                    - generic [ref=e500]: star
                    - generic [ref=e501]: star
                    - generic [ref=e502]: star
                    - generic [ref=e503]: star
                    - generic [ref=e504]: star
                  - generic [ref=e505]: (234)
                - generic [ref=e506]:
                  - generic [ref=e507]:
                    - generic [ref=e508]: ৳189,000
                    - generic [ref=e509]: ৳199,000
                  - paragraph [ref=e510]: Save ৳10,000
                - button "shopping_bag Add to Cart" [ref=e511]:
                  - generic [ref=e512]: shopping_bag
                  - text: Add to Cart
            - link "image -14% NEW Add to wishlist Official Store Apple AirPods Pro 3 star star star star star (789) ৳29,999 ৳34,999 Save ৳5,000 shopping_bag Add to Cart" [ref=e513] [cursor=pointer]:
              - /url: /product/prod_6
              - generic [ref=e514]:
                - generic [ref=e516]: image
                - generic [ref=e517]:
                  - generic [ref=e518]: "-14%"
                  - generic [ref=e519]: NEW
                - button "Add to wishlist" [ref=e520]:
                  - generic [ref=e521]: favorite
              - generic [ref=e522]:
                - generic [ref=e523]:
                  - img [ref=e524]
                  - generic [ref=e526]:
                    - img [ref=e527]
                    - text: Official Store
                - heading "Apple AirPods Pro 3" [level=3] [ref=e530]
                - generic [ref=e531]:
                  - generic [ref=e532]:
                    - generic [ref=e533]: star
                    - generic [ref=e534]: star
                    - generic [ref=e535]: star
                    - generic [ref=e536]: star
                    - generic [ref=e537]: star
                  - generic [ref=e538]: (789)
                - generic [ref=e539]:
                  - generic [ref=e540]:
                    - generic [ref=e541]: ৳29,999
                    - generic [ref=e542]: ৳34,999
                  - paragraph [ref=e543]: Save ৳5,000
                - button "shopping_bag Add to Cart" [ref=e544]:
                  - generic [ref=e545]: shopping_bag
                  - text: Add to Cart
            - link "Samsung Galaxy Watch 7 -10% NEW Add to wishlist Official Store Samsung Galaxy Watch 7 star star star star star (312) ৳45,000 ৳49,999 Save ৳4,999 shopping_bag Add to Cart" [ref=e546] [cursor=pointer]:
              - /url: /product/prod_7
              - generic [ref=e547]:
                - img "Samsung Galaxy Watch 7" [ref=e548]
                - generic [ref=e549]:
                  - generic [ref=e550]: "-10%"
                  - generic [ref=e551]: NEW
                - button "Add to wishlist" [ref=e552]:
                  - generic [ref=e553]: favorite
              - generic [ref=e554]:
                - generic [ref=e555]:
                  - img [ref=e556]
                  - generic [ref=e558]:
                    - img [ref=e559]
                    - text: Official Store
                - heading "Samsung Galaxy Watch 7" [level=3] [ref=e562]
                - generic [ref=e563]:
                  - generic [ref=e564]:
                    - generic [ref=e565]: star
                    - generic [ref=e566]: star
                    - generic [ref=e567]: star
                    - generic [ref=e568]: star
                    - generic [ref=e569]: star
                  - generic [ref=e570]: (312)
                - generic [ref=e571]:
                  - generic [ref=e572]:
                    - generic [ref=e573]: ৳45,000
                    - generic [ref=e574]: ৳49,999
                  - paragraph [ref=e575]: Save ৳4,999
                - button "shopping_bag Add to Cart" [ref=e576]:
                  - generic [ref=e577]: shopping_bag
                  - text: Add to Cart
        - generic [ref=e580]:
          - generic [ref=e581]:
            - generic [ref=e583]: verified
            - generic [ref=e584]:
              - heading "100% Authentic" [level=4] [ref=e586]
              - paragraph [ref=e587]: Genuine products with brand warranty on every purchase
              - generic [ref=e588]: Verified
          - generic [ref=e589]:
            - generic [ref=e591]: lock
            - generic [ref=e592]:
              - heading "Secure Payments" [level=4] [ref=e594]
              - paragraph [ref=e595]: SSL encrypted. bKash, Nagad, cards & COD accepted
              - generic [ref=e596]: SSL Secured
          - generic [ref=e597]:
            - generic [ref=e599]: local_shipping
            - generic [ref=e600]:
              - heading "Nationwide Delivery" [level=4] [ref=e602]
              - paragraph [ref=e603]: Free shipping on orders over ৳999 across Bangladesh
              - generic [ref=e604]: Free Shipping
          - generic [ref=e605]:
            - generic [ref=e607]: assignment_return
            - generic [ref=e608]:
              - heading "Easy Returns" [level=4] [ref=e610]
              - paragraph [ref=e611]: 7-day hassle-free return policy, no questions asked
              - generic [ref=e612]: 7-Day Policy
        - generic [ref=e615]:
          - generic [ref=e616]:
            - heading "Top Brands" [level=2] [ref=e618]
            - link "View All chevron_right" [ref=e619] [cursor=pointer]:
              - /url: /categories
              - text: View All
              - generic [ref=e620]: chevron_right
          - generic [ref=e622]:
            - link "Samsung" [ref=e623] [cursor=pointer]:
              - /url: /brand/samsung
              - img [ref=e626]
              - generic [ref=e628]: Samsung
            - link "Apple" [ref=e629] [cursor=pointer]:
              - /url: /brand/apple
              - img [ref=e632]
              - generic [ref=e634]: Apple
            - link "Xiaomi" [ref=e635] [cursor=pointer]:
              - /url: /brand/xiaomi
              - img [ref=e638]
              - generic [ref=e655]: Xiaomi
            - link "Walton" [ref=e656] [cursor=pointer]:
              - /url: /brand/walton
              - img [ref=e659]
              - generic [ref=e661]: Walton
            - link "Asus" [ref=e662] [cursor=pointer]:
              - /url: /brand/asus
              - img [ref=e665]
              - generic [ref=e667]: Asus
            - link "Lenovo" [ref=e668] [cursor=pointer]:
              - /url: /brand/lenovo
              - img [ref=e671]
              - generic [ref=e673]: Lenovo
            - link "HP" [ref=e674] [cursor=pointer]:
              - /url: /brand/hp
              - img [ref=e677]
              - generic [ref=e679]: HP
            - link "Realme" [ref=e680] [cursor=pointer]:
              - /url: /brand/realme
              - img [ref=e683]
              - generic [ref=e685]: Realme
            - link "Samsung" [ref=e686] [cursor=pointer]:
              - /url: /brand/samsung
              - img [ref=e689]
              - generic [ref=e691]: Samsung
            - link "Apple" [ref=e692] [cursor=pointer]:
              - /url: /brand/apple
              - img [ref=e695]
              - generic [ref=e697]: Apple
            - link "Xiaomi" [ref=e698] [cursor=pointer]:
              - /url: /brand/xiaomi
              - img [ref=e701]
              - generic [ref=e718]: Xiaomi
            - link "Walton" [ref=e719] [cursor=pointer]:
              - /url: /brand/walton
              - img [ref=e722]
              - generic [ref=e724]: Walton
            - link "Asus" [ref=e725] [cursor=pointer]:
              - /url: /brand/asus
              - img [ref=e728]
              - generic [ref=e730]: Asus
            - link "Lenovo" [ref=e731] [cursor=pointer]:
              - /url: /brand/lenovo
              - img [ref=e734]
              - generic [ref=e736]: Lenovo
            - link "HP" [ref=e737] [cursor=pointer]:
              - /url: /brand/hp
              - img [ref=e740]
              - generic [ref=e742]: HP
            - link "Realme" [ref=e743] [cursor=pointer]:
              - /url: /brand/realme
              - img [ref=e746]
              - generic [ref=e748]: Realme
        - generic [ref=e753]:
          - generic [ref=e755]: storefront
          - generic [ref=e756]:
            - heading "Start Selling on AmarShop" [level=3] [ref=e757]
            - paragraph [ref=e758]: Reach millions of customers across Bangladesh. Zero listing fees.
            - generic [ref=e759]:
              - generic [ref=e760]:
                - generic [ref=e761]: 2M+
                - generic [ref=e762]: Customers
              - generic [ref=e763]:
                - generic [ref=e764]: 50k+
                - generic [ref=e765]: Sellers
              - generic [ref=e766]:
                - generic [ref=e767]: 0%
                - generic [ref=e768]: Listing Fee
          - link "Join Free" [ref=e769] [cursor=pointer]:
            - /url: /seller/dashboard
            - text: Join Free
            - img [ref=e770]
        - generic [ref=e773]:
          - generic [ref=e774]:
            - heading "Just For You" [level=2] [ref=e777]
            - link "See All" [ref=e778] [cursor=pointer]:
              - /url: /categories
              - text: See All
              - img [ref=e779]
          - generic [ref=e781]:
            - link "iPhone 16 Pro Max -6% NEW Add to wishlist Official Store iPhone 16 Pro Max star star star star star (1.2k) ৳159,999 ৳169,999 Save ৳10,000 shopping_bag Add to Cart" [ref=e782] [cursor=pointer]:
              - /url: /product/prod_1
              - generic [ref=e783]:
                - img "iPhone 16 Pro Max" [ref=e784]
                - generic [ref=e785]:
                  - generic [ref=e786]: "-6%"
                  - generic [ref=e787]: NEW
                - button "Add to wishlist" [ref=e788]:
                  - generic [ref=e789]: favorite
              - generic [ref=e790]:
                - generic [ref=e791]:
                  - img [ref=e792]
                  - generic [ref=e794]:
                    - img [ref=e795]
                    - text: Official Store
                - heading "iPhone 16 Pro Max" [level=3] [ref=e798]
                - generic [ref=e799]:
                  - generic [ref=e800]:
                    - generic [ref=e801]: star
                    - generic [ref=e802]: star
                    - generic [ref=e803]: star
                    - generic [ref=e804]: star
                    - generic [ref=e805]: star
                  - generic [ref=e806]: (1.2k)
                - generic [ref=e807]:
                  - generic [ref=e808]:
                    - generic [ref=e809]: ৳159,999
                    - generic [ref=e810]: ৳169,999
                  - paragraph [ref=e811]: Save ৳10,000
                - button "shopping_bag Add to Cart" [ref=e812]:
                  - generic [ref=e813]: shopping_bag
                  - text: Add to Cart
            - link "Samsung Galaxy S25 Ultra -7% NEW Add to wishlist Official Store Samsung Galaxy S25 Ultra star star star star star (892) ৳139,999 ৳149,999 Save ৳10,000 shopping_bag Add to Cart" [ref=e814] [cursor=pointer]:
              - /url: /product/prod_2
              - generic [ref=e815]:
                - img "Samsung Galaxy S25 Ultra" [ref=e816]
                - generic [ref=e817]:
                  - generic [ref=e818]: "-7%"
                  - generic [ref=e819]: NEW
                - button "Add to wishlist" [ref=e820]:
                  - generic [ref=e821]: favorite
              - generic [ref=e822]:
                - generic [ref=e823]:
                  - img [ref=e824]
                  - generic [ref=e826]:
                    - img [ref=e827]
                    - text: Official Store
                - heading "Samsung Galaxy S25 Ultra" [level=3] [ref=e830]
                - generic [ref=e831]:
                  - generic [ref=e832]:
                    - generic [ref=e833]: star
                    - generic [ref=e834]: star
                    - generic [ref=e835]: star
                    - generic [ref=e836]: star
                    - generic [ref=e837]: star
                  - generic [ref=e838]: (892)
                - generic [ref=e839]:
                  - generic [ref=e840]:
                    - generic [ref=e841]: ৳139,999
                    - generic [ref=e842]: ৳149,999
                  - paragraph [ref=e843]: Save ৳10,000
                - button "shopping_bag Add to Cart" [ref=e844]:
                  - generic [ref=e845]: shopping_bag
                  - text: Add to Cart
            - link "MacBook Air M4 -6% NEW Add to wishlist Official Store MacBook Air M4 star star star star star (654) ৳145,000 ৳155,000 Save ৳10,000 shopping_bag Add to Cart" [ref=e846] [cursor=pointer]:
              - /url: /product/prod_3
              - generic [ref=e847]:
                - img "MacBook Air M4" [ref=e848]
                - generic [ref=e849]:
                  - generic [ref=e850]: "-6%"
                  - generic [ref=e851]: NEW
                - button "Add to wishlist" [ref=e852]:
                  - generic [ref=e853]: favorite
              - generic [ref=e854]:
                - generic [ref=e855]:
                  - img [ref=e856]
                  - generic [ref=e858]:
                    - img [ref=e859]
                    - text: Official Store
                - heading "MacBook Air M4" [level=3] [ref=e862]
                - generic [ref=e863]:
                  - generic [ref=e864]:
                    - generic [ref=e865]: star
                    - generic [ref=e866]: star
                    - generic [ref=e867]: star
                    - generic [ref=e868]: star
                    - generic [ref=e869]: star
                  - generic [ref=e870]: (654)
                - generic [ref=e871]:
                  - generic [ref=e872]:
                    - generic [ref=e873]: ৳145,000
                    - generic [ref=e874]: ৳155,000
                  - paragraph [ref=e875]: Save ৳10,000
                - button "shopping_bag Add to Cart" [ref=e876]:
                  - generic [ref=e877]: shopping_bag
                  - text: Add to Cart
            - link "Sony WH-1000XM6 Headphones -12% NEW Add to wishlist Sony Sony WH-1000XM6 Headphones star star star star star (423) ৳35,000 ৳39,999 Save ৳4,999 shopping_bag Add to Cart" [ref=e878] [cursor=pointer]:
              - /url: /product/prod_4
              - generic [ref=e879]:
                - img "Sony WH-1000XM6 Headphones" [ref=e880]
                - generic [ref=e881]:
                  - generic [ref=e882]: "-12%"
                  - generic [ref=e883]: NEW
                - button "Add to wishlist" [ref=e884]:
                  - generic [ref=e885]: favorite
              - generic [ref=e886]:
                - paragraph [ref=e888]: Sony
                - heading "Sony WH-1000XM6 Headphones" [level=3] [ref=e889]
                - generic [ref=e890]:
                  - generic [ref=e891]:
                    - generic [ref=e892]: star
                    - generic [ref=e893]: star
                    - generic [ref=e894]: star
                    - generic [ref=e895]: star
                    - generic [ref=e896]: star
                  - generic [ref=e897]: (423)
                - generic [ref=e898]:
                  - generic [ref=e899]:
                    - generic [ref=e900]: ৳35,000
                    - generic [ref=e901]: ৳39,999
                  - paragraph [ref=e902]: Save ৳4,999
                - button "shopping_bag Add to Cart" [ref=e903]:
                  - generic [ref=e904]: shopping_bag
                  - text: Add to Cart
            - link "Dell XPS 16 Laptop -5% Add to wishlist Dell Dell XPS 16 Laptop star star star star star (234) ৳189,000 ৳199,000 Save ৳10,000 shopping_bag Add to Cart" [ref=e905] [cursor=pointer]:
              - /url: /product/prod_5
              - generic [ref=e906]:
                - img "Dell XPS 16 Laptop" [ref=e907]
                - generic [ref=e909]: "-5%"
                - button "Add to wishlist" [ref=e910]:
                  - generic [ref=e911]: favorite
              - generic [ref=e912]:
                - paragraph [ref=e914]: Dell
                - heading "Dell XPS 16 Laptop" [level=3] [ref=e915]
                - generic [ref=e916]:
                  - generic [ref=e917]:
                    - generic [ref=e918]: star
                    - generic [ref=e919]: star
                    - generic [ref=e920]: star
                    - generic [ref=e921]: star
                    - generic [ref=e922]: star
                  - generic [ref=e923]: (234)
                - generic [ref=e924]:
                  - generic [ref=e925]:
                    - generic [ref=e926]: ৳189,000
                    - generic [ref=e927]: ৳199,000
                  - paragraph [ref=e928]: Save ৳10,000
                - button "shopping_bag Add to Cart" [ref=e929]:
                  - generic [ref=e930]: shopping_bag
                  - text: Add to Cart
            - link "Apple AirPods Pro 3 -14% NEW Add to wishlist Official Store Apple AirPods Pro 3 star star star star star (789) ৳29,999 ৳34,999 Save ৳5,000 shopping_bag Add to Cart" [ref=e931] [cursor=pointer]:
              - /url: /product/prod_6
              - generic [ref=e932]:
                - img "Apple AirPods Pro 3" [ref=e933]
                - generic [ref=e934]:
                  - generic [ref=e935]: "-14%"
                  - generic [ref=e936]: NEW
                - button "Add to wishlist" [ref=e937]:
                  - generic [ref=e938]: favorite
              - generic [ref=e939]:
                - generic [ref=e940]:
                  - img [ref=e941]
                  - generic [ref=e943]:
                    - img [ref=e944]
                    - text: Official Store
                - heading "Apple AirPods Pro 3" [level=3] [ref=e947]
                - generic [ref=e948]:
                  - generic [ref=e949]:
                    - generic [ref=e950]: star
                    - generic [ref=e951]: star
                    - generic [ref=e952]: star
                    - generic [ref=e953]: star
                    - generic [ref=e954]: star
                  - generic [ref=e955]: (789)
                - generic [ref=e956]:
                  - generic [ref=e957]:
                    - generic [ref=e958]: ৳29,999
                    - generic [ref=e959]: ৳34,999
                  - paragraph [ref=e960]: Save ৳5,000
                - button "shopping_bag Add to Cart" [ref=e961]:
                  - generic [ref=e962]: shopping_bag
                  - text: Add to Cart
            - link "Samsung Galaxy Watch 7 -10% NEW Add to wishlist Official Store Samsung Galaxy Watch 7 star star star star star (312) ৳45,000 ৳49,999 Save ৳4,999 shopping_bag Add to Cart" [ref=e963] [cursor=pointer]:
              - /url: /product/prod_7
              - generic [ref=e964]:
                - img "Samsung Galaxy Watch 7" [ref=e965]
                - generic [ref=e966]:
                  - generic [ref=e967]: "-10%"
                  - generic [ref=e968]: NEW
                - button "Add to wishlist" [ref=e969]:
                  - generic [ref=e970]: favorite
              - generic [ref=e971]:
                - generic [ref=e972]:
                  - img [ref=e973]
                  - generic [ref=e975]:
                    - img [ref=e976]
                    - text: Official Store
                - heading "Samsung Galaxy Watch 7" [level=3] [ref=e979]
                - generic [ref=e980]:
                  - generic [ref=e981]:
                    - generic [ref=e982]: star
                    - generic [ref=e983]: star
                    - generic [ref=e984]: star
                    - generic [ref=e985]: star
                    - generic [ref=e986]: star
                  - generic [ref=e987]: (312)
                - generic [ref=e988]:
                  - generic [ref=e989]:
                    - generic [ref=e990]: ৳45,000
                    - generic [ref=e991]: ৳49,999
                  - paragraph [ref=e992]: Save ৳4,999
                - button "shopping_bag Add to Cart" [ref=e993]:
                  - generic [ref=e994]: shopping_bag
                  - text: Add to Cart
            - link "Logitech MX Master 4 Mouse -13% Add to wishlist Logitech Logitech MX Master 4 Mouse star star star star star (156) ৳12,999 ৳14,999 Save ৳2,000 shopping_bag Add to Cart" [ref=e995] [cursor=pointer]:
              - /url: /product/prod_8
              - generic [ref=e996]:
                - img "Logitech MX Master 4 Mouse" [ref=e997]
                - generic [ref=e999]: "-13%"
                - button "Add to wishlist" [ref=e1000]:
                  - generic [ref=e1001]: favorite
              - generic [ref=e1002]:
                - paragraph [ref=e1004]: Logitech
                - heading "Logitech MX Master 4 Mouse" [level=3] [ref=e1005]
                - generic [ref=e1006]:
                  - generic [ref=e1007]:
                    - generic [ref=e1008]: star
                    - generic [ref=e1009]: star
                    - generic [ref=e1010]: star
                    - generic [ref=e1011]: star
                    - generic [ref=e1012]: star
                  - generic [ref=e1013]: (156)
                - generic [ref=e1014]:
                  - generic [ref=e1015]:
                    - generic [ref=e1016]: ৳12,999
                    - generic [ref=e1017]: ৳14,999
                  - paragraph [ref=e1018]: Save ৳2,000
                - button "shopping_bag Add to Cart" [ref=e1019]:
                  - generic [ref=e1020]: shopping_bag
                  - text: Add to Cart
            - link "Anker PowerCore 26800 Portable Charger -14% Add to wishlist Anker Anker PowerCore 26800 Portable Charger star star star star star (2.3k) ৳5,999 ৳6,999 Save ৳1,000 shopping_bag Add to Cart" [ref=e1021] [cursor=pointer]:
              - /url: /product/prod_9
              - generic [ref=e1022]:
                - img "Anker PowerCore 26800 Portable Charger" [ref=e1023]
                - generic [ref=e1025]: "-14%"
                - button "Add to wishlist" [ref=e1026]:
                  - generic [ref=e1027]: favorite
              - generic [ref=e1028]:
                - paragraph [ref=e1030]: Anker
                - heading "Anker PowerCore 26800 Portable Charger" [level=3] [ref=e1031]
                - generic [ref=e1032]:
                  - generic [ref=e1033]:
                    - generic [ref=e1034]: star
                    - generic [ref=e1035]: star
                    - generic [ref=e1036]: star
                    - generic [ref=e1037]: star
                    - generic [ref=e1038]: star
                  - generic [ref=e1039]: (2.3k)
                - generic [ref=e1040]:
                  - generic [ref=e1041]:
                    - generic [ref=e1042]: ৳5,999
                    - generic [ref=e1043]: ৳6,999
                  - paragraph [ref=e1044]: Save ৳1,000
                - button "shopping_bag Add to Cart" [ref=e1045]:
                  - generic [ref=e1046]: shopping_bag
                  - text: Add to Cart
            - link "JBL Flip 7 Bluetooth Speaker -11% NEW Add to wishlist JBL JBL Flip 7 Bluetooth Speaker star star star star star (445) ৳15,999 ৳17,999 Save ৳2,000 shopping_bag Add to Cart" [ref=e1047] [cursor=pointer]:
              - /url: /product/prod_10
              - generic [ref=e1048]:
                - img "JBL Flip 7 Bluetooth Speaker" [ref=e1049]
                - generic [ref=e1050]:
                  - generic [ref=e1051]: "-11%"
                  - generic [ref=e1052]: NEW
                - button "Add to wishlist" [ref=e1053]:
                  - generic [ref=e1054]: favorite
              - generic [ref=e1055]:
                - paragraph [ref=e1057]: JBL
                - heading "JBL Flip 7 Bluetooth Speaker" [level=3] [ref=e1058]
                - generic [ref=e1059]:
                  - generic [ref=e1060]:
                    - generic [ref=e1061]: star
                    - generic [ref=e1062]: star
                    - generic [ref=e1063]: star
                    - generic [ref=e1064]: star
                    - generic [ref=e1065]: star
                  - generic [ref=e1066]: (445)
                - generic [ref=e1067]:
                  - generic [ref=e1068]:
                    - generic [ref=e1069]: ৳15,999
                    - generic [ref=e1070]: ৳17,999
                  - paragraph [ref=e1071]: Save ৳2,000
                - button "shopping_bag Add to Cart" [ref=e1072]:
                  - generic [ref=e1073]: shopping_bag
                  - text: Add to Cart
            - link "Nike Air Max 270 Shoes -17% Add to wishlist Official Store Nike Air Max 270 Shoes star star star star star (892) ৳12,500 ৳15,000 Save ৳2,500 shopping_bag Add to Cart" [ref=e1074] [cursor=pointer]:
              - /url: /product/prod_11
              - generic [ref=e1075]:
                - img "Nike Air Max 270 Shoes" [ref=e1076]
                - generic [ref=e1078]: "-17%"
                - button "Add to wishlist" [ref=e1079]:
                  - generic [ref=e1080]: favorite
              - generic [ref=e1081]:
                - generic [ref=e1082]:
                  - img [ref=e1083]
                  - generic [ref=e1085]:
                    - img [ref=e1086]
                    - text: Official Store
                - heading "Nike Air Max 270 Shoes" [level=3] [ref=e1089]
                - generic [ref=e1090]:
                  - generic [ref=e1091]:
                    - generic [ref=e1092]: star
                    - generic [ref=e1093]: star
                    - generic [ref=e1094]: star
                    - generic [ref=e1095]: star
                    - generic [ref=e1096]: star
                  - generic [ref=e1097]: (892)
                - generic [ref=e1098]:
                  - generic [ref=e1099]:
                    - generic [ref=e1100]: ৳12,500
                    - generic [ref=e1101]: ৳15,000
                  - paragraph [ref=e1102]: Save ৳2,500
                - button "shopping_bag Add to Cart" [ref=e1103]:
                  - generic [ref=e1104]: shopping_bag
                  - text: Add to Cart
            - link "Adidas Ultraboost 22 Running Shoes -15% Add to wishlist Official Store Adidas Ultraboost 22 Running Shoes star star star star star (567) ৳14,500 ৳17,000 Save ৳2,500 shopping_bag Add to Cart" [ref=e1105] [cursor=pointer]:
              - /url: /product/prod_12
              - generic [ref=e1106]:
                - img "Adidas Ultraboost 22 Running Shoes" [ref=e1107]
                - generic [ref=e1109]: "-15%"
                - button "Add to wishlist" [ref=e1110]:
                  - generic [ref=e1111]: favorite
              - generic [ref=e1112]:
                - generic [ref=e1113]:
                  - img [ref=e1114]
                  - generic [ref=e1116]:
                    - img [ref=e1117]
                    - text: Official Store
                - heading "Adidas Ultraboost 22 Running Shoes" [level=3] [ref=e1120]
                - generic [ref=e1121]:
                  - generic [ref=e1122]:
                    - generic [ref=e1123]: star
                    - generic [ref=e1124]: star
                    - generic [ref=e1125]: star
                    - generic [ref=e1126]: star
                    - generic [ref=e1127]: star
                  - generic [ref=e1128]: (567)
                - generic [ref=e1129]:
                  - generic [ref=e1130]:
                    - generic [ref=e1131]: ৳14,500
                    - generic [ref=e1132]: ৳17,000
                  - paragraph [ref=e1133]: Save ৳2,500
                - button "shopping_bag Add to Cart" [ref=e1134]:
                  - generic [ref=e1135]: shopping_bag
                  - text: Add to Cart
    - contentinfo [ref=e1136]:
      - generic [ref=e1142]:
        - generic [ref=e1143]:
          - img [ref=e1145]
          - generic [ref=e1148]:
            - heading "Stay in the Loop" [level=3] [ref=e1149]
            - paragraph [ref=e1150]: Exclusive deals, launches & offers — straight to your inbox.
        - generic [ref=e1151]:
          - generic [ref=e1152]:
            - img [ref=e1153]
            - textbox "Your email address" [ref=e1156]
          - button "Subscribe" [ref=e1157]:
            - text: Subscribe
            - img [ref=e1158]
      - generic [ref=e1160]:
        - generic [ref=e1161]:
          - generic [ref=e1162]:
            - link "AmarShop" [ref=e1163] [cursor=pointer]:
              - /url: /
              - img "AmarShop" [ref=e1164]
            - paragraph [ref=e1165]: Bangladesh's premium online marketplace. Shop millions of products from trusted sellers with fast delivery and the best deals.
            - generic [ref=e1166]:
              - heading "Follow Us" [level=4] [ref=e1167]
              - generic [ref=e1168]:
                - link "Facebook" [ref=e1169] [cursor=pointer]:
                  - /url: "#"
                  - img [ref=e1170]
                - link "Instagram" [ref=e1172] [cursor=pointer]:
                  - /url: "#"
                  - img [ref=e1173]
                - link "X (Twitter)" [ref=e1175] [cursor=pointer]:
                  - /url: "#"
                  - img [ref=e1176]
                - link "YouTube" [ref=e1178] [cursor=pointer]:
                  - /url: "#"
                  - img [ref=e1179]
                - link "LinkedIn" [ref=e1181] [cursor=pointer]:
                  - /url: https://www.linkedin.com/in/md-shawon-molla-2a3877293/
                  - img [ref=e1182]
                - link "GitHub" [ref=e1184] [cursor=pointer]:
                  - /url: https://github.com/shawon2210
                  - img [ref=e1185]
          - generic [ref=e1188]:
            - button "Customer Service" [ref=e1190]:
              - text: Customer Service
              - img [ref=e1191]
            - button "Shop Categories" [ref=e1194]:
              - text: Shop Categories
              - img [ref=e1195]
            - button "Seller Center" [ref=e1198]:
              - text: Seller Center
              - img [ref=e1199]
            - button "Company" [ref=e1202]:
              - text: Company
              - img [ref=e1203]
        - generic [ref=e1206]:
          - generic [ref=e1207]:
            - heading "Download App" [level=4] [ref=e1208]
            - generic [ref=e1210]:
              - link "Download on Google Play" [ref=e1211] [cursor=pointer]:
                - /url: "#"
                - img [ref=e1213]
                - generic [ref=e1215]:
                  - paragraph [ref=e1216]: Download on
                  - paragraph [ref=e1217]: Google Play
              - link "Download on App Store" [ref=e1218] [cursor=pointer]:
                - /url: "#"
                - img [ref=e1220]
                - generic [ref=e1222]:
                  - paragraph [ref=e1223]: Download on
                  - paragraph [ref=e1224]: App Store
          - generic [ref=e1225]:
            - heading "Accepted Payments" [level=4] [ref=e1226]
            - generic [ref=e1228]:
              - generic "bKash" [ref=e1229]:
                - img [ref=e1230]:
                  - generic [ref=e1232]: bKash
              - generic "Nagad" [ref=e1233]:
                - img [ref=e1234]:
                  - generic [ref=e1236]: Nagad
              - generic "Rocket" [ref=e1237]:
                - img [ref=e1238]:
                  - generic [ref=e1240]: Rocket
              - generic "Visa" [ref=e1241]:
                - img [ref=e1242]:
                  - generic [ref=e1244]: VISA
              - generic "Mastercard" [ref=e1245]:
                - img [ref=e1246]
              - generic "American Express" [ref=e1250]:
                - img [ref=e1251]:
                  - generic [ref=e1253]: AMEX
              - generic "PayPal" [ref=e1254]:
                - img [ref=e1255]:
                  - generic [ref=e1257]: PayPal
              - generic "COD" [ref=e1258]:
                - img [ref=e1259]:
                  - generic [ref=e1261]: COD
          - generic [ref=e1263]:
            - heading "Delivery Partners" [level=4] [ref=e1264]
            - generic [ref=e1265]:
              - generic [ref=e1266]: Pathao
              - generic [ref=e1267]: RedX
              - generic [ref=e1268]: Steadfast
              - generic [ref=e1269]: Sundarban
              - generic [ref=e1270]: Paperfly
        - generic [ref=e1272]:
          - generic [ref=e1273]:
            - img [ref=e1274]
            - text: 100% Secure Payment
          - paragraph [ref=e1277]: © 2026 AmarShop. All rights reserved.
          - generic [ref=e1278]:
            - link "Privacy" [ref=e1279] [cursor=pointer]:
              - /url: /privacy
            - link "Terms" [ref=e1280] [cursor=pointer]:
              - /url: /terms
            - link "Support" [ref=e1281] [cursor=pointer]:
              - /url: /support/chat
            - link "Track Order" [ref=e1282] [cursor=pointer]:
              - /url: /orders
    - navigation "Mobile navigation" [ref=e1283]:
      - link "home Home" [ref=e1284] [cursor=pointer]:
        - /url: /
        - generic [ref=e1285]: home
        - generic [ref=e1286]: Home
      - link "category Categories" [ref=e1287] [cursor=pointer]:
        - /url: /categories
        - generic [ref=e1288]: category
        - generic [ref=e1289]: Categories
      - link "mail Messages" [ref=e1290] [cursor=pointer]:
        - /url: /messages
        - generic [ref=e1291]: mail
        - generic [ref=e1292]: Messages
      - link "shopping_cart Cart" [ref=e1293] [cursor=pointer]:
        - /url: /cart
        - generic [ref=e1294]: shopping_cart
        - generic [ref=e1295]: Cart
      - link "person Account" [ref=e1296] [cursor=pointer]:
        - /url: /account
        - generic [ref=e1297]: person
        - generic [ref=e1298]: Account
  - generic [ref=e1303] [cursor=pointer]:
    - button "Open Next.js Dev Tools" [ref=e1304]:
      - img [ref=e1305]
    - generic [ref=e1308]:
      - button "Open issues overlay" [ref=e1309]:
        - generic [ref=e1310]:
          - generic [ref=e1311]: "0"
          - generic [ref=e1312]: "1"
        - generic [ref=e1313]: Issue
      - button "Collapse issues badge" [ref=e1314]:
        - img [ref=e1315]
  - alert [ref=e1317]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Search overlay - focus trapping and Esc close', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     await page.goto('/');
  6   |     await page.waitForLoadState('load');
  7   |   });
  8   | 
  9   |   test('opens via desktop search button and focuses the input', async ({ page }) => {
  10  |     const searchBtn = page.locator('header button:has-text("Search products")');
  11  |     await searchBtn.click();
  12  | 
  13  |     const overlay = page.locator('[role="dialog"][aria-label="Search products"]');
  14  |     await expect(overlay).toBeVisible();
  15  | 
  16  |     const input = overlay.locator('input[aria-label="Search"]');
  17  |     await expect(input).toBeFocused();
  18  |   });
  19  | 
  20  |   test('opens via mobile search button and focuses the input', async ({ page }) => {
  21  |     await page.setViewportSize({ width: 375, height: 667 });
  22  | 
  23  |     const searchBtn = page.locator('header button[aria-label="Search"]');
  24  |     await searchBtn.click();
  25  | 
  26  |     const overlay = page.locator('[role="dialog"][aria-label="Search products"]');
  27  |     await expect(overlay).toBeVisible();
  28  | 
  29  |     const input = overlay.locator('input[aria-label="Search"]');
  30  |     await expect(input).toBeFocused();
  31  |   });
  32  | 
  33  |   test('closes on Escape key', async ({ page }) => {
  34  |     const searchBtn = page.locator('header button:has-text("Search products")');
  35  |     await searchBtn.click();
  36  | 
  37  |     const overlay = page.locator('[role="dialog"][aria-label="Search products"]');
  38  |     await expect(overlay).toBeVisible();
  39  | 
  40  |     await page.keyboard.press('Escape');
  41  |     await expect(overlay).not.toBeVisible();
  42  |   });
  43  | 
  44  |   test('closes when clicking backdrop outside the panel', async ({ page }) => {
  45  |     const searchBtn = page.locator('header button:has-text("Search products")');
> 46  |     await searchBtn.click();
      |                     ^ Error: locator.click: Test timeout of 30000ms exceeded.
  47  | 
  48  |     const overlay = page.locator('[role="dialog"][aria-label="Search products"]');
  49  |     await expect(overlay).toBeVisible();
  50  | 
  51  |     await page.mouse.click(640, 750);
  52  |     await expect(overlay).not.toBeVisible();
  53  |   });
  54  | 
  55  |   test('admin search overlay triggers via Open search button', async ({ page }) => {
  56  |     await page.goto('/admin');
  57  |     await page.waitForLoadState('load');
  58  | 
  59  |     const openBtn = page.locator('button[aria-label="Open search"]');
  60  |     if (await openBtn.isVisible()) {
  61  |       await openBtn.click();
  62  |       const dialog = page.locator('[role="dialog"][aria-label="Search"]');
  63  |       await expect(dialog).toBeVisible();
  64  |       await page.keyboard.press('Escape');
  65  |       await expect(dialog).not.toBeVisible();
  66  |     } else {
  67  |       test.skip(page.url().includes('/admin/login'), 'Requires authentication');
  68  |     }
  69  |   });
  70  | 
  71  |   test('admin search overlay closes on backdrop click', async ({ page }) => {
  72  |     await page.goto('/admin');
  73  |     await page.waitForLoadState('load');
  74  | 
  75  |     const openBtn = page.locator('button[aria-label="Open search"]');
  76  |     if (!(await openBtn.isVisible())) {
  77  |       test.skip(true, 'Requires authentication');
  78  |       return;
  79  |     }
  80  | 
  81  |     await openBtn.click();
  82  |     const dialog = page.locator('[role="dialog"][aria-label="Search"]');
  83  |     await expect(dialog).toBeVisible();
  84  | 
  85  |     await page.mouse.click(10, 10);
  86  |     await expect(dialog).not.toBeVisible();
  87  |   });
  88  | 
  89  |   test('body overflow is hidden while overlay is open', async ({ page }) => {
  90  |     const searchBtn = page.locator('header button:has-text("Search products")');
  91  |     await searchBtn.click();
  92  | 
  93  |     const hasHidden = await page.evaluate(() => document.body.style.overflow === 'hidden');
  94  |     expect(hasHidden).toBe(true);
  95  | 
  96  |     await page.keyboard.press('Escape');
  97  |     const hasAuto = await page.evaluate(() => document.body.style.overflow === '');
  98  |     expect(hasAuto).toBe(true);
  99  |   });
  100 | });
  101 | 
```
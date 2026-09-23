// Product catalogue — names/platforms mirror real trending titles seen on the
// live storefront. Every Steam title's `image` uses Valve's own header.jpg
// asset (the official card art, not a community remix) via the public
// appdetails API, hotlinked (not downloaded/stored here) the same way
// price-comparison sites usually do this. Deliberately using ONE consistent
// asset type across every title — mixing header/hero/backdrop images (as an
// earlier version of this file did) meant each had a different native
// aspect ratio, so the crop against a fixed card box looked inconsistent
// from card to card. header.jpg is guaranteed available for every title and
// is always 460x215, so cropping is uniform across the whole catalogue.
// `os` (Windows/Mac/Linux compatibility) also comes from appdetails.
// `cover` gradient colors remain the fallback for the handful of non-Steam
// listings (memberships / Xbox) with no public CDN image source.
// Pricing: `was` is the Steam US list price (store.steampowered.com appdetails,
// fetched 2026-09-16). Games are then priced by TIER (see applyTier below);
// memberships and gift cards keep their own `now`.
export const PRODUCTS = [
  { id: 'spiderman', name: "Marvel's Spider-Man Remastered PC", platform: 'steam', category: 'pc', tag: 'Bestseller', was: 59.99, now: 24, cover: ["#3a1a5c","#0f0a24"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1817070/header.jpg', os: ["windows"], reviews: { positive: 138082, negative: 5728, total: 143810 } },
  { id: 'clair-obscur', name: "Clair Obscur: Expedition 33 PC", platform: 'steam', category: 'pc', tag: 'Award Winner', was: 49.99, now: 20, cover: ["#7a2b3a","#20101c"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1903340/be3305b02d4db0dffa3458537118423bf2792d7e/header.jpg', os: ["windows"], reviews: { positive: 265644, negative: 13277, total: 278921 } },
  { id: 'clair-obscur-deluxe', name: "Clair Obscur: Expedition 33 Deluxe Edition PC", platform: 'steam', category: 'pc', tag: 'Deluxe', was: 64.99, now: 26, cover: ["#8a3b2a","#241108"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1903340/be3305b02d4db0dffa3458537118423bf2792d7e/header.jpg', os: ["windows"], reviews: { positive: 265644, negative: 13277, total: 278921 } },
  { id: 'arc-raiders', name: "ARC Raiders PC", platform: 'steam', category: 'pc', tag: 'New', was: 39.99, now: 16, cover: ["#1c3a4a","#081018"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1808500/b1379225bf8d50a4b4ad26aad2c637278222a20c/header_alt_assets_7.jpg', os: ["windows"], reviews: { positive: 340800, negative: 75679, total: 416479 } },
  { id: 'v-rising', name: "V Rising PC", platform: 'steam', category: 'pc', tag: 'Trending', was: 34.99, now: 14, cover: ["#661827","#150507"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1604030/be49834ab147ad22ba17005fb847c93917d18b97/header.jpg', os: ["windows"], reviews: { positive: 122091, negative: 15162, total: 137253 } },
  // Pulled fresh from Steam's live top-sellers/specials charts (same fetch
  // that feeds the homepage bundle hero gallery) rather than the static
  // demo tags below — `trendingNow` marks genuinely current trending picks.
  { id: 'valheim', name: "Valheim PC", platform: 'steam', category: 'pc', tag: 'Trending', was: 29.99, now: 12, cover: ["#1f3d2a","#08150c"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/892970/1888731b59362fca6c026cdbafa3dfffd45c3146/header_alt_assets_6.jpg', os: ["windows","mac","linux"], trendingNow: true, reviews: { positive: 517441, negative: 34261, total: 551702 } },
  { id: 'blood-of-dawnwalker', name: "The Blood of Dawnwalker PC", platform: 'steam', category: 'pc', tag: 'Trending', was: 69.99, now: 28, cover: ["#5c1f1f","#150606"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3751260/a7062f3b59d491c2678e3fd7ce2672858e480641/header.jpg', os: ["windows"], trendingNow: true, reviews: { positive: 21473, negative: 3265, total: 24738 } },
  { id: '007-first-light', name: "007 First Light PC", platform: 'steam', category: 'pc', tag: 'Trending', was: 79.99, now: 32, cover: ["#1a2540","#050810"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3768760/6646220d04fce26fc441f589e8f98d66c9e33b9c/header_alt_assets_2.jpg', os: ["windows"], trendingNow: true, reviews: { positive: 42460, negative: 4075, total: 46535 } },
  { id: 'inzoi', name: "inZOI PC", platform: 'steam', category: 'pc', tag: 'Trending', was: 39.99, now: 16, cover: ["#8a5a2a","#1c1006"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2456740/89acee5c3d965af802002617d6c130e5e03bd240/header.jpg', os: ["windows","mac"], trendingNow: true, reviews: { positive: 25563, negative: 7476, total: 33039 } },
  { id: 'soulmask', name: "Soulmask PC", platform: 'steam', category: 'pc', tag: 'Early Access', was: 29.99, now: 12, cover: ["#274a2e","#0a140b"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2646460/8580b9d3a4f484c8e865a51c89c8307521716151/header_alt_assets_29.jpg', os: ["windows"], reviews: { positive: 17294, negative: 5160, total: 22454 } },
  { id: 'halo-campaign', name: "Halo: Campaign Evolved Premium Edition Xbox / PC", platform: 'xbox', category: 'consoles', tag: 'Pre-Order', was: 89.99, now: 36, cover: ["#0e3350","#061019"] },
  { id: 'motogp26', name: "MotoGP 26 PC", platform: 'steam', category: 'pc', tag: 'New Release', was: 59.99, now: 24, cover: ["#5c2c0e","#160a02"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3875050/b53a48a0eb23496725d62cd610096ce95a8491f1/header.jpg', os: ["windows"], reviews: { positive: 210, negative: 109, total: 319 } },
  { id: 'marathon', name: "Marathon PC", platform: 'steam', category: 'pc', tag: 'New', was: 39.99, now: 16, cover: ["#1b1b3a","#08081a"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3065800/c3093fec19fed6eb0750a87261c53743a5757827/header.jpg', os: ["windows"], reviews: { positive: 49133, negative: 15078, total: 64211 } },
  { id: 'solo-leveling', name: "Solo Leveling: ARISE OVERDRIVE PC", platform: 'steam', category: 'pc', tag: 'Anime', was: 39.99, now: 16, cover: ["#3a1030","#100310"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2373990/018068a74847b3953278efacca07cfbe537a46c7/header.jpg', os: ["windows"], reviews: { positive: 6552, negative: 2658, total: 9210 } },
  { id: 'blue-reflection', name: "BLUE REFLECTION Quartet PC", platform: 'steam', category: 'pc', tag: 'JRPG', was: 49.99, now: 20, cover: ["#123a4d","#04121a"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3825390/9a5bc55299ab11f82ef6187b9d9fd452d7cad8ed/header.jpg', os: ["windows"], reviews: { positive: 151, negative: 78, total: 229 } },
  { id: 'beast-reincarnation', name: "Beast of Reincarnation PC", platform: 'steam', category: 'pc', tag: 'Indie', was: 59.99, now: 24, cover: ["#3d2a10","#120c03"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2001760/d068139fe039e26a6a9d9f57ac5d89785b984d33/header.jpg', os: ["windows"], reviews: { positive: 3651, negative: 2557, total: 6208 } },
  { id: 'shift-midnight', name: "Shift At Midnight PC", platform: 'steam', category: 'pc', tag: 'Horror', was: 9.99, now: 4, cover: ["#2a0e3d","#0a0312"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3722330/759ecea2ffe1ad3819aefdda79e265b8b332bf8f/header.jpg', os: ["windows"], reviews: { positive: 10668, negative: 1485, total: 12153 } },
  { id: 'mound-cthulhu', name: "The Mound: Omen of Cthulhu PC", platform: 'steam', category: 'pc', tag: 'Horror', was: 29.99, now: 12, cover: ["#0e2a26","#020c0a"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2569760/cefd63a1434b8a43790c7ea49a69b400257ef4cd/header_alt_assets_0.jpg', os: ["windows"], reviews: { positive: 2830, negative: 1274, total: 4104 } },
  { id: 'le-mans', name: "Le Mans Ultimate - US Track Pass PC - DLC", platform: 'steam', category: 'pc', tag: 'DLC', was: 14.99, now: 6, cover: ["#4d1414","#150404"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2399420/f510badbf573eecdf529ae735a49331f4b9919be/header.jpg', os: ["windows"], reviews: { positive: 15883, negative: 4288, total: 20171 } },
  { id: 'ps-plus', name: "PlayStation Plus Essential 12 Month Membership", platform: 'playstation', category: 'consoles', tag: 'Membership', was: 59.99, now: 24, cover: ["#0e2c66","#050b1c"] },
  { id: 'xbox-gamepass', name: "Xbox Game Pass Ultimate 3 Month", platform: 'xbox', category: 'consoles', tag: 'Membership', was: 44.99, now: 18, cover: ["#0e5c2a","#03180c"] },
  { id: 'switch-online', name: "Nintendo Switch Online 12 Month Individual", platform: 'nintendo', category: 'consoles', tag: 'Membership', was: 19.99, now: 8, cover: ["#661111","#1a0404"] },
  { id: 'bodycam', name: "Bodycam PC", platform: 'steam', category: 'pc', tag: 'Deal', was: 33.32, now: 13.33, cover: ["hsl(170, 45%, 20%)","hsl(170, 45%, 7%)"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2406770/8d2765de57931435f802fa6757ad6920aea8646a/header_alt_assets_0.jpg', os: ["windows"], reviews: { positive: 52296, negative: 12865, total: 65161 } },
  { id: 'no-man-s-sky', name: "No Man's Sky PC", platform: 'steam', category: 'pc', tag: 'Deal', was: 59.99, now: 24, cover: ["hsl(90, 45%, 20%)","hsl(90, 45%, 7%)"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/275850/2c6e38b43a5309dfcd3cc0f0134e222b0fa2d1b1/header_alt_assets_25.jpg', os: ["windows","mac"], trendingNow: true, reviews: { positive: 357673, negative: 62040, total: 419713 } },
  { id: 'wanderburg', name: "Wanderburg PC", platform: 'steam', category: 'pc', tag: 'Deal', was: 14.99, now: 6, cover: ["hsl(20, 45%, 20%)","hsl(20, 45%, 7%)"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3624140/1af8e0906799b8c9063d0e5031571aef48b55605/header_alt_assets_2.jpg', os: ["windows"], reviews: { positive: 2106, negative: 567, total: 2673 } },
  { id: 'grand-theft-auto-v-enhanced', name: "Grand Theft Auto V Enhanced PC", platform: 'steam', category: 'pc', tag: 'Deal', was: 29.99, now: 12, cover: ["hsl(220, 45%, 20%)","hsl(220, 45%, 7%)"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3240220/header.jpg', os: ["windows"], trendingNow: true, reviews: { positive: 187543, negative: 38335, total: 225878 } },
  { id: 'resident-evil-requiem', name: "Resident Evil Requiem PC", platform: 'steam', category: 'pc', tag: 'Deal', was: 69.99, now: 28, cover: ["hsl(40, 45%, 20%)","hsl(40, 45%, 7%)"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3764200/ce5437442768e38eb575f205ab9397d0264017b0/header.jpg', os: ["windows"], reviews: { positive: 177259, negative: 7502, total: 184761 } },
  { id: 'call-of-duty-black-ops-iii', name: "Call of Duty®: Black Ops III PC", platform: 'steam', category: 'pc', tag: 'Deal', was: 59.99, now: 24, cover: ["hsl(170, 45%, 20%)","hsl(170, 45%, 7%)"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/311210/header.jpg', os: ["windows","mac"], reviews: { positive: 199402, negative: 34712, total: 234114 } },
  { id: 'ready-or-not', name: "Ready or Not PC", platform: 'steam', category: 'pc', tag: 'Deal', was: 49.99, now: 20, cover: ["hsl(120, 45%, 20%)","hsl(120, 45%, 7%)"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1144200/2b44644b033a996a9efb95051bb01809215d0d23/header.jpg', os: ["windows"], reviews: { positive: 273581, negative: 73507, total: 347088 } },
  { id: 'gamble-with-your-friends', name: "Gamble With Your Friends PC", platform: 'steam', category: 'pc', tag: 'Deal', was: 7.99, now: 3.2, cover: ["hsl(310, 45%, 20%)","hsl(310, 45%, 7%)"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3892270/395e6d7972474333a698b26f8aa5597bf38109a1/header.jpg', os: ["windows"], reviews: { positive: 20427, negative: 2378, total: 22805 } },
  { id: 'warhammer-40-000-space-marine-2', name: "Warhammer 40,000: Space Marine 2 PC", platform: 'steam', category: 'pc', tag: 'Deal', was: 59.99, now: 24, cover: ["hsl(140, 45%, 20%)","hsl(140, 45%, 7%)"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2183900/header.jpg', os: ["windows"], reviews: { positive: 190080, negative: 36190, total: 226270 } },
  { id: 'pragmata', name: "PRAGMATA PC", platform: 'steam', category: 'pc', tag: 'Deal', was: 59.99, now: 24, cover: ["hsl(290, 45%, 20%)","hsl(290, 45%, 7%)"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3357650/e32e168b25ed68a0cf6264c220c07e96c2abfb56/header.jpg', os: ["windows"], reviews: { positive: 51411, negative: 1842, total: 53253 } },
  { id: 'wardogs', name: "WARDOGS PC", platform: 'steam', category: 'pc', tag: 'Bestseller', was: 39.99, now: 16, cover: ["hsl(280, 45%, 20%)","hsl(280, 45%, 7%)"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1867240/59d4daf753bd5d982e6675f7eee363bc817c574e/header.jpg', os: ["windows"], reviews: { positive: 60893, negative: 16358, total: 77251 } },
  { id: 'wardogs-supporter-edition', name: "WARDOGS - Supporter Edition PC", platform: 'steam', category: 'pc', tag: 'Bestseller', was: 49.99, now: 20, cover: ["hsl(167, 45%, 20%)","hsl(167, 45%, 7%)"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/subs/1746527/3bd4b35869293fe4f74eca49e899e483666cd729/header_ratio.jpg', os: ["windows"] },
  { id: 'halloween-the-game', name: "Halloween: The Game PC", platform: 'steam', category: 'pc', tag: 'Bestseller', was: 39.99, now: 16, cover: ["hsl(150, 45%, 20%)","hsl(150, 45%, 7%)"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3219630/153ed105c4b409fe689783e4f9b6aad72c152646/header.jpg', os: ["windows"], reviews: { positive: 9628, negative: 4574, total: 14202 } },
  { id: 'fallout-1st', name: "Fallout 1st PC", platform: 'steam', category: 'pc', tag: 'Bestseller', was: 12.99, now: 5.2, cover: ["hsl(120, 45%, 20%)","hsl(120, 45%, 7%)"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1202520/header.jpg', os: ["windows"], reviews: { positive: 985, negative: 1470, total: 2455 } },
  { id: 'ea-play', name: "EA Play PC", platform: 'steam', category: 'pc', tag: 'Bestseller', was: 5.99, now: 2.4, cover: ["hsl(150, 45%, 20%)","hsl(150, 45%, 7%)"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1289670/ceda3c4ec3c3f9e0f9d64d9a8edf392a8a445f26/header.jpg', os: ["windows"], reviews: { positive: 6, negative: 6, total: 12 } },
  { id: 'iracing', name: "iRacing PC", platform: 'steam', category: 'pc', tag: 'Bestseller', was: 11.59, now: 4.64, cover: ["hsl(10, 45%, 20%)","hsl(10, 45%, 7%)"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/266410/header.jpg', os: ["windows"], reviews: { positive: 6522, negative: 1131, total: 7653 } },
  { id: 'gambit-loop', name: "Gambit Loop PC", platform: 'steam', category: 'pc', tag: 'New', was: 4.99, now: 2, cover: ["hsl(0, 45%, 20%)","hsl(0, 45%, 7%)"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4531320/44b7ec95fbc5d7ced73f4425d5eb0c1883c78c7e/header.jpg', os: ["windows","linux"], reviews: { positive: 3, negative: 2, total: 5 } },
  { id: 'delicious-recipe-for-renewal', name: "Delicious - Recipe for Renewal PC", platform: 'steam', category: 'pc', tag: 'New', was: 19.99, now: 8, cover: ["hsl(260, 45%, 20%)","hsl(260, 45%, 7%)"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4193540/e3e4bfad8a6c1f1022d31e43a4289a6193237ba7/header.jpg', os: ["windows","mac"], reviews: { positive: 1, negative: 0, total: 1 } },
  { id: 'hot-wheels-infinite-rush', name: "HOT WHEELS™ Infinite Rush PC", platform: 'steam', category: 'pc', tag: 'New', was: 49.99, now: 20, cover: ["hsl(70, 45%, 20%)","hsl(70, 45%, 7%)"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2821390/fcc8da12187b981034dd54170d47b45db8e22b8e/header.jpg', os: ["windows"], reviews: { positive: 59, negative: 29, total: 88 } },
  { id: 'big-breakfast-2', name: "Big Breakfast 2 PC", platform: 'steam', category: 'pc', tag: 'New', was: 3.99, now: 1.6, cover: ["hsl(330, 45%, 20%)","hsl(330, 45%, 7%)"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4839090/a45d7088dc44201390e8581880f98dc866e98cf2/header.jpg', os: ["windows"], reviews: { positive: 2, negative: 0, total: 2 } },
  { id: 'black-friday-janitor-clean-the-whole-mal', name: "Black Friday Janitor: Clean the Whole Mall PC", platform: 'steam', category: 'pc', tag: 'New', was: 5.99, now: 2.4, cover: ["hsl(130, 45%, 20%)","hsl(130, 45%, 7%)"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3396010/41253ba91e9865e6644784f06985c58c1b465479/header.jpg', os: ["windows"], reviews: { positive: 345, negative: 9, total: 354 } },
  { id: 'the-things-we-don-t-see-10-interactive-s', name: "The Things We Don't See: 10 Interactive Stories of Horror, Mystery, and the Unknown PC", platform: 'steam', category: 'pc', tag: 'New', was: 5.99, now: 2.4, cover: ["hsl(60, 45%, 20%)","hsl(60, 45%, 7%)"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/5148420/b2b453c0728824bc43b7dbd8146dc9b5031fb1c2/header.jpg', os: ["windows","mac","linux"], reviews: { positive: 0, negative: 0, total: 0 } },
  { id: 'jiahao', name: "Jiahao PC", platform: 'steam', category: 'pc', tag: 'New', was: 2.99, now: 1.2, cover: ["hsl(150, 45%, 20%)","hsl(150, 45%, 7%)"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/5001630/65eb2c000979c01229bd73139b06a0921a5c3d31/header.jpg', os: ["windows","mac"], reviews: { positive: 180, negative: 26, total: 206 } },
  { id: 'super-takoyaki-battle', name: "Super Takoyaki Battle PC", platform: 'steam', category: 'pc', tag: 'New', was: 6.99, now: 2.8, cover: ["hsl(150, 45%, 20%)","hsl(150, 45%, 7%)"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/5086590/fc2756b5ccca5883c39b73d9956e67c5aed2312d/header.jpg', os: ["windows"], reviews: { positive: 2, negative: 0, total: 2 } },
  { id: 'elegorithm', name: "Elegorithm PC", platform: 'steam', category: 'pc', tag: 'New', was: 5.99, now: 2.4, cover: ["hsl(270, 45%, 20%)","hsl(270, 45%, 7%)"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4872150/e5fd2ef56eb98b6917008182c3087f6182e9028c/header.jpg', os: ["windows"], reviews: { positive: 3, negative: 0, total: 3 } },
  { id: 'platina-lab', name: "PLATiNA :: LAB PC", platform: 'steam', category: 'pc', tag: 'New', was: 19.99, now: 8, cover: ["hsl(30, 45%, 20%)","hsl(30, 45%, 7%)"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3430470/55001f20ddf0af30e523b24d15c2906c128e7097/header_alt_assets_0.jpg', os: ["windows"], reviews: { positive: 1122, negative: 1130, total: 2252 } },
  { id: 'fruitimo-juicy-night-ride', name: "Fruitimo! Juicy Night Ride PC", platform: 'steam', category: 'pc', tag: 'New', was: 5.99, now: 2.4, cover: ["hsl(20, 45%, 20%)","hsl(20, 45%, 7%)"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4399580/3c2e5139b72c84bce73ace1e6ae7167b55ed68d4/header.jpg', os: ["windows"], reviews: { positive: 1, negative: 0, total: 1 } },
  { id: 'dungeon-brawls', name: "Dungeon Brawls PC", platform: 'steam', category: 'pc', tag: 'New', was: 9.99, now: 4, cover: ["hsl(80, 45%, 20%)","hsl(80, 45%, 7%)"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4246640/840d2e34e3364f7770ee04621530d3d29781fd29/header.jpg', os: ["windows"], reviews: { positive: 242, negative: 80, total: 322 } },
  { id: 'critical-chaos', name: "Critical Chaos PC", platform: 'steam', category: 'pc', tag: 'New', was: 14.99, now: 6, cover: ["hsl(60, 45%, 20%)","hsl(60, 45%, 7%)"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4203420/c36496df24b61c36fe95860b685733e0fd3242c7/header.jpg', os: ["windows"], reviews: { positive: 0, negative: 0, total: 0 } },
  { id: 'push-push', name: "Push Push PC", platform: 'steam', category: 'pc', tag: 'New', was: 4.99, now: 2, cover: ["hsl(260, 45%, 20%)","hsl(260, 45%, 7%)"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3967820/9bd94f41d7bec64492bd41bf19d13939a49a617d/header.jpg', os: ["windows"], reviews: { positive: 137, negative: 4, total: 141 } },
  { id: 'slime-slayer-endless-loot', name: "Slime Slayer: Endless Loot PC", platform: 'steam', category: 'pc', tag: 'New', was: 7.99, now: 3.2, cover: ["hsl(160, 45%, 20%)","hsl(160, 45%, 7%)"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4522480/85e225191bd33a903e971345c59f5d729af6ce5a/header.jpg', os: ["windows"], reviews: { positive: 38, negative: 10, total: 48 } },
  { id: 'aura-farming-simulator', name: "Aura Farming Simulator PC", platform: 'steam', category: 'pc', tag: 'New', was: 1.99, now: 0.8, cover: ["hsl(20, 45%, 20%)","hsl(20, 45%, 7%)"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/5044340/1abd49160bd2701c0a84e345da615eb9dddb0477/header.jpg', os: ["windows"], reviews: { positive: 1, negative: 0, total: 1 } },
  { id: 'doa6lr-character-unlock-key-minato-debut', name: "DOA6LR Character Unlock Key: Minato + Debut Costume Bundle PC", platform: 'steam', category: 'pc', tag: 'New', was: 14.99, now: 6, cover: ["hsl(300, 45%, 20%)","hsl(300, 45%, 7%)"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/5123460/b35ef35b99e95402ab7dc1f2db349ad88ae7db8d/header.jpg', os: ["windows"], reviews: { positive: 10, negative: 5, total: 15 } },
  { id: 'doa6lr-character-unlock-key-minato', name: "DOA6LR Character Unlock Key: Minato PC", platform: 'steam', category: 'pc', tag: 'New', was: 7.99, now: 3.2, cover: ["hsl(290, 45%, 20%)","hsl(290, 45%, 7%)"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/5123450/09153439147a6aee17db99a2b580c9246f5b3f96/header.jpg', os: ["windows"], reviews: { positive: 7, negative: 9, total: 16 } },
  { id: 'fuyukuru-winter-winds-adieu', name: "Fuyukuru. - Winter winds, adieu? - PC", platform: 'steam', category: 'pc', tag: 'New', was: 19.99, now: 8, cover: ["hsl(70, 45%, 20%)","hsl(70, 45%, 7%)"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4264270/9e809a248fd60012ee964a1c0e0e29babbebf613/header.jpg', os: ["windows"], reviews: { positive: 45, negative: 1, total: 46 } },
  { id: 'chicken-miner', name: "Chicken Miner PC", platform: 'steam', category: 'pc', tag: 'New', was: 3.99, now: 1.6, cover: ["hsl(270, 45%, 20%)","hsl(270, 45%, 7%)"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4622310/50d72a13bfde02f51e3e7225af765d7a4e6192aa/header.jpg', os: ["windows"], reviews: { positive: 29, negative: 5, total: 34 } },
  { id: 'led-hearts', name: "LED HEARTS PC", platform: 'steam', category: 'pc', tag: 'New', was: 4.99, now: 2, cover: ["hsl(190, 45%, 20%)","hsl(190, 45%, 7%)"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/5034070/7fce2699f444abf825c1e2ea09dfe1b7545707ac/header.jpg', os: ["windows"], reviews: { positive: 7, negative: 2, total: 9 } },
  { id: 'artillery-miner', name: "Artillery Miner PC", platform: 'steam', category: 'pc', tag: 'New', was: 7.99, now: 3.2, cover: ["hsl(100, 45%, 20%)","hsl(100, 45%, 7%)"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4391380/715bcdbb8b875a7557a03a890fb415e67aad066d/header.jpg', os: ["windows"], reviews: { positive: 165, negative: 54, total: 219 } },
  { id: 'total-futsal-manager', name: "Total Futsal Manager PC", platform: 'steam', category: 'pc', tag: 'New', was: 14.99, now: 6, cover: ["hsl(200, 45%, 20%)","hsl(200, 45%, 7%)"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/5113640/8f0b67f20f1c9b5b127100c196986a2321b61589/header.jpg', os: ["windows"], reviews: { positive: 2, negative: 0, total: 2 } },
  { id: 'roomrush-racer', name: "Roomrush Racer PC", platform: 'steam', category: 'pc', tag: 'New', was: 18.99, now: 7.6, cover: ["hsl(260, 45%, 20%)","hsl(260, 45%, 7%)"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4729940/23392fdeba7804a2bee152d625e401d32c4b8a8c/header.jpg', os: ["windows"], reviews: { positive: 2, negative: 0, total: 2 } },
  { id: 'aretias-cursed-island', name: "ARETIAS: Cursed Island PC", platform: 'steam', category: 'pc', tag: 'New', was: 6.99, now: 2.8, cover: ["hsl(40, 45%, 20%)","hsl(40, 45%, 7%)"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/5158120/cc2706586a7e2a54d44b07959ccf4df00bfc37f6/header.jpg', os: ["windows"], reviews: { positive: 3, negative: 0, total: 3 } },
  { id: 'inkubo', name: "INKUBO PC", platform: 'steam', category: 'pc', tag: 'New', was: 3.99, now: 1.6, cover: ["hsl(310, 45%, 20%)","hsl(310, 45%, 7%)"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4754110/c7f3a7ae7d29d2b13586f4c283581c57d94dd8df/header.jpg', os: ["windows"], reviews: { positive: 4, negative: 0, total: 4 } },
  { id: 'hazard-pay', name: "Hazard Pay PC", platform: 'steam', category: 'pc', tag: 'Pre-Order', was: 16.99, now: 6.8, cover: ["hsl(180, 45%, 20%)","hsl(180, 45%, 7%)"], image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2692620/36163167ab14742e9395f0c75ca7db0d95746f7b/header.jpg', os: ["windows","mac","linux"], reviews: { positive: 30, negative: 0, total: 30 } },
  // AAA spotlight titles — the nine games featured in the homepage hero.
  // Prices from Steam US list (fetched 2026-09-18); same flat 60% off as the rest.
  { id: "rdr2", name: "Red Dead Redemption 2 PC", platform: 'steam', category: 'pc', tag: 'AAA', was: 59.99, now: 24, cover: ["#5a1a12", "#170604"], image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1174180/header.jpg", os: ["windows"], spotlight: true, reviews: { positive: 851329, negative: 69143, total: 920472 } },
  { id: "cyberpunk", name: "Cyberpunk 2077 PC", platform: 'steam', category: 'pc', tag: 'AAA', was: 59.99, now: 24, cover: ["#6a6a10", "#1a1a04"], image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/e9047d8ec47ae3d94bb8b464fb0fc9e9972b4ac7/header.jpg", os: ["windows", "mac"], spotlight: true, reviews: { positive: 852614, negative: 128500, total: 981114 } },
  { id: "elden-ring", name: "ELDEN RING PC", platform: 'steam', category: 'pc', tag: 'AAA', was: 59.99, now: 24, cover: ["#5a4a1a", "#160f04"], image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/f0b19c231f86fa0e633ff88a1a63459443017728/header_alt_assets_3.jpg", os: ["windows"], spotlight: true, reviews: { positive: 1075333, negative: 80426, total: 1155759 } },
  { id: "bg3", name: "Baldur's Gate 3 PC", platform: 'steam', category: 'pc', tag: 'AAA', was: 59.99, now: 24, cover: ["#2a1a4a", "#0a0616"], image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1086940/48a2fcbda8565bb45025e98fd8ebde8a7203f6a0/header.jpg", os: ["windows", "mac"], spotlight: true, reviews: { positive: 830905, negative: 27592, total: 858497 } },
  { id: "gow-ragnarok", name: "God of War Ragnarök PC", platform: 'steam', category: 'pc', tag: 'AAA', was: 59.99, now: 24, cover: ["#1a3a4a", "#06121a"], image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2322010/header.jpg", os: ["windows"], spotlight: true, reviews: { positive: 44737, negative: 5586, total: 50323 } },
  { id: "spiderman-2", name: "Marvel's Spider-Man 2 PC", platform: 'steam', category: 'pc', tag: 'AAA', was: 59.99, now: 24, cover: ["#6a1a1a", "#1a0606"], image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2651280/header.jpg", os: ["windows"], spotlight: true, reviews: { positive: 39825, negative: 7878, total: 47703 } },
  { id: "wukong", name: "Black Myth: Wukong PC", platform: 'steam', category: 'pc', tag: 'AAA', was: 59.99, now: 24, cover: ["#3a2a1a", "#120c06"], image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2358720/header.jpg", os: ["windows"], spotlight: true, reviews: { positive: 1169510, negative: 42610, total: 1212120 } },
  { id: "ghost-of-tsushima", name: "Ghost of Tsushima Director's Cut PC", platform: 'steam', category: 'pc', tag: 'AAA', was: 59.99, now: 24, cover: ["#4a1a1a", "#160606"], image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2215430/header.jpg", os: ["windows"], spotlight: true, reviews: { positive: 90894, negative: 5850, total: 96744 } },
  { id: "borderlands-3", name: "Borderlands 3 PC", platform: 'steam', category: 'pc', tag: 'AAA', was: 59.99, now: 24, cover: ["#6a3a1a", "#1a0e06"], image: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/397540/header.jpg", os: ["windows"], spotlight: true, reviews: { positive: 132953, negative: 31105, total: 164058 } },
  // Gift cards — sold at 5% under face value (not the 60% game-key discount).
  { id: 'steam-wallet-10', name: "Steam Wallet Code $10 (US)", platform: 'steam', category: 'gift-cards', tag: 'Gift Card', kind: 'giftcard', was: 10, now: 9.5, cover: ["#1b2838", "#0b1219"] },
  { id: 'steam-wallet-20', name: "Steam Wallet Code $20 (US)", platform: 'steam', category: 'gift-cards', tag: 'Gift Card', kind: 'giftcard', was: 20, now: 19, cover: ["#1b2838", "#0b1219"] },
  { id: 'steam-wallet-50', name: "Steam Wallet Code $50 (US)", platform: 'steam', category: 'gift-cards', tag: 'Gift Card', kind: 'giftcard', was: 50, now: 47.5, cover: ["#1b2838", "#0b1219"] },
  { id: 'steam-wallet-100', name: "Steam Wallet Code $100 (US)", platform: 'steam', category: 'gift-cards', tag: 'Gift Card', kind: 'giftcard', was: 100, now: 95, cover: ["#1b2838", "#0b1219"] },
  { id: 'psn-card-10', name: "PlayStation Store Gift Card $10 (US)", platform: 'playstation', category: 'gift-cards', tag: 'Gift Card', kind: 'giftcard', was: 10, now: 9.5, cover: ["#0e2c66", "#050b1c"] },
  { id: 'psn-card-25', name: "PlayStation Store Gift Card $25 (US)", platform: 'playstation', category: 'gift-cards', tag: 'Gift Card', kind: 'giftcard', was: 25, now: 23.75, cover: ["#0e2c66", "#050b1c"] },
  { id: 'psn-card-50', name: "PlayStation Store Gift Card $50 (US)", platform: 'playstation', category: 'gift-cards', tag: 'Gift Card', kind: 'giftcard', was: 50, now: 47.5, cover: ["#0e2c66", "#050b1c"] },
  { id: 'xbox-card-10', name: "Xbox Gift Card $10 (US)", platform: 'xbox', category: 'gift-cards', tag: 'Gift Card', kind: 'giftcard', was: 10, now: 9.5, cover: ["#0e5c2a", "#03180c"] },
  { id: 'xbox-card-25', name: "Xbox Gift Card $25 (US)", platform: 'xbox', category: 'gift-cards', tag: 'Gift Card', kind: 'giftcard', was: 25, now: 23.75, cover: ["#0e5c2a", "#03180c"] },
  { id: 'xbox-card-50', name: "Xbox Gift Card $50 (US)", platform: 'xbox', category: 'gift-cards', tag: 'Gift Card', kind: 'giftcard', was: 50, now: 47.5, cover: ["#0e5c2a", "#03180c"] },
  { id: 'eshop-card-10', name: "Nintendo eShop Card $10 (US)", platform: 'nintendo', category: 'gift-cards', tag: 'Gift Card', kind: 'giftcard', was: 10, now: 9.5, cover: ["#661111", "#1a0404"] },
  { id: 'eshop-card-20', name: "Nintendo eShop Card $20 (US)", platform: 'nintendo', category: 'gift-cards', tag: 'Gift Card', kind: 'giftcard', was: 20, now: 19, cover: ["#661111", "#1a0404"] },
  { id: 'eshop-card-50', name: "Nintendo eShop Card $50 (US)", platform: 'nintendo', category: 'gift-cards', tag: 'Gift Card', kind: 'giftcard', was: 50, now: 47.5, cover: ["#661111", "#1a0404"] },
];

export const CATEGORIES = [
  { key: 'pc', label: 'PC Games', color: '#3aa6ff', tint: 'rgba(58,166,255,.14)' },
  { key: 'consoles', label: 'Consoles & Memberships', color: '#7cc6ff', tint: 'rgba(124,198,255,.12)' },
  { key: 'gift-cards', label: 'Gift Cards', color: '#ffd166', tint: 'rgba(255,209,102,.12)' },
  { key: 'deals', label: 'Deals', color: '#38bdf8', tint: 'rgba(56,189,248,.12)' },
];

export function discountPct(p) {
  return Math.max(0, Math.round((1 - p.now / p.was) * 100));
}

// ---------------------------------------------------------------------------
// Tiered game pricing (INR). Tier 1 = top trending / AAA, Tier 2 = mid,
// Tier 3 = value. Every Steam game gets one; the tier sets its price.
// ---------------------------------------------------------------------------
export const TIERS = {
  1: { price: 1499, label: 'Tier 1', name: 'Top tier', blurb: 'Trending blockbusters and AAA hits' },
  2: { price: 999, label: 'Tier 2', name: 'Mid tier', blurb: 'Popular, well-reviewed favourites' },
  3: { price: 499, label: 'Tier 3', name: 'Value tier', blurb: 'Indies, classics and hidden gems' },
};

// rank: popularity position in the Steam catalogue (0 = most owned), or null.
export function tierFor({ listUsd, rank, spotlight, tag }) {
  if (spotlight) return 1;
  if (rank != null) {
    if (rank < 600 && listUsd >= 25) return 1;
    if (rank < 3000 || listUsd >= 20) return 2;
    return 3;
  }
  const hot = ['Bestseller', 'Trending', 'Award Winner', 'AAA', 'New Release', 'Deluxe'].includes(tag);
  if (hot && listUsd >= 40) return 1;
  if (listUsd >= 20) return 2;
  return 3;
}

// Sets p.tier and p.now (kept in the same USD-equivalent unit as `was` so
// formatINR() renders the exact tier price).
export function applyTier(p, rank = null) {
  p.tier = tierFor({ listUsd: p.was, rank, spotlight: p.spotlight, tag: p.tag });
  p.now = TIERS[p.tier].price / INR_RATE;
  return p;
}

export function tierPriceINR(tier) {
  return TIERS[tier]?.price ?? null;
}

export function money(n) {
  return '$' + n.toFixed(2);
}

// Prices are authored in USD above; this is a static demo conversion rate
// (not live FX data) so every price on the site reads consistently in INR.
export const INR_RATE = 83;

export function formatINR(usd) {
  return '₹' + Math.round(usd * INR_RATE).toLocaleString('en-IN');
}

// Catalogue products (the big Steam list, loaded lazily by data/catalog.js)
// register themselves here so findProduct works for `s<appid>` ids too.
const EXTRA = new Map();
export function registerCatalog(items) {
  for (const p of items) EXTRA.set(p.id, p);
}

export function findProduct(id) {
  return PRODUCTS.find((p) => p.id === id) || EXTRA.get(id);
}

// Small deterministic hash so "random-looking" mock data (ratings, stock levels)
// stays stable across renders instead of reshuffling every time.
export function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

export function rating(product) {
  // Real Steam review ratio mapped to a 3–5 star scale; null when unknown.
  if (product.reviews && product.reviews.total > 0) {
    return +(3 + 2 * (product.reviews.positive / product.reviews.total)).toFixed(1);
  }
  return null;
}

export function reviewCount(product) {
  return product.reviews && product.reviews.total > 0 ? product.reviews.total : null;
}

// Price every curated Steam game by its tier (memberships / gift cards keep their own prices).
for (const p of PRODUCTS) {
  if (p.category === 'pc' && p.platform === 'steam' && p.kind !== 'giftcard') applyTier(p);
}

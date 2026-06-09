const hotels = [
  { name: 'The Grand Mamta', stars: 5, price: 7567, location: 'Dal Lake, Srinagar', image: 'https://content.jdmagicbox.com/comp/srinagar/t1/9999px194.x194.140214144911.v8t1/catalogue/the-grand-mamta-dalgate-srinagar-hotels-8yg4lk0uhj-250.jpg', amenities: ['Spa', 'Pool', 'Lake View', 'Restaurant', 'WiFi'], rating: 4.9, reviews: 328 },
  { name: 'The Vintage Gulmarg Hotel', stars: 4, price: 5500, location: 'Gulmarg', image: 'https://q-xx.bstatic.com/xdata/images/hotel/max500/120476505.jpg?k=53397b8ba9061325e3edf0d9487ab227938cc264e90212ec6e4fdf8659479180&o=', amenities: ['Ski Access', 'Fireplace', 'Mountain View', 'WiFi'], rating: 4.7, reviews: 215 },
  { name: 'Hotel heevan', stars: 4, price: 4200, location: 'Pahalgam', image: 'https://api.blessingsonthenet.com/uploads/hotels/f9459e71094ffa6f5787a6300b7682f5-1690776776192-Hotel-Heevan-Pahalgam_1.jpg', amenities: ['River View', 'Trekking', 'Restaurant', 'WiFi'], rating: 4.6, reviews: 189 },
  { name: 'GuestHouser 3BHK HouseBoat', stars: 5, price: 7200, location: 'Dal Lake', image: 'https://pix10.agoda.net/hotelImages/4948199/0/44611f9ce1bad53b154ed11f237cf455.jpeg?ce=0&s=1024x768', amenities: ['Shikara Ride', 'Breakfast', 'Lake View', 'WiFi'], rating: 4.8, reviews: 412 },
  { name: 'Hotel Snow Land', stars: 3, price: 3000, location: 'Sonamarg', image: 'https://r1imghtlak.mmtcdn.com/6a7c0e24528811ec96ac0a58a9feac02.jpg', amenities: ['Glacier View', 'Bonfire', 'Restaurant'], rating: 4.4, reviews: 97 },
  { name: 'Grand bagh resort', stars: 4, price: 4800, location: 'Dachigam National Park', image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/637073343.jpg?k=4c5a108b9f48afb826e157af140c7b1c77ed1fde9a7396369e63da2b5a4b8515&o=', amenities: ['Kayaking', 'Breakfast', 'Lake View', 'WiFi'], rating: 4.5, reviews: 143 },
  { name: 'Fortune Resort Heevan', stars: 4, price: 4800, location: 'Mughal Gardens', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/30/28/2f/55/main-pic-of-our-hotel.jpg?w=900&h=500&s=1', amenities: ['Kayaking', 'Breakfast', 'WiFi'], rating: 4.5, reviews: 143 },
];

const restaurants = [
  { name: 'Gani Sons Wazwan House', cuisine: 'Traditional Kashmiri', price: '777', location: 'Lal Chowk, Srinagar', rating: 4.9, specialty: 'Rogan Josh, Gushtaba', image: 'https://content3.jdmagicbox.com/comp/srinagar/r2/9999px194.x194.220103212409.p6r2/catalogue/gani-sons-wazwan-gogji-bagh-srinagar-restaurants-7g7qksw8uh.jpg', timings: '12pm - 10pm' },
  { name: 'Taj Dal View Restaurant', cuisine: 'Multi-Cuisine', price: 'Premium', location: 'Boulevard Road', rating: 4.7, specialty: 'Yakhni, Dum Aloo', image: 'https://cdn.sanity.io/images/ocl5w36p/ihcl_prod/a4f7ae6cca7d0491f758133fe80e84d6b274cdc3-1295x720.jpg?w=480&auto=format&dpr=2', timings: '7am - 11pm' },
  { name: 'Mughal Darbar', cuisine: 'Mughlai & Kashmiri', price: 'Moderate', location: 'Residency Road', rating: 4.6, specialty: 'Seekh Kebab, Biryani', image: 'https://media-cdn.tripadvisor.com/media/photo-s/08/46/a6/53/mughal-darbar.jpg', timings: '10am - 11pm' },
  { name: 'Igloo Cafe Gulmarg', cuisine: 'Cafe & Bakery', price: 'Moderate', location: 'Gulmarg Market', rating: 4.5, specialty: 'Kehwa, Sheermal', image: 'https://resize.indiatvnews.com/en/centered/newbucket/1200_675/2022/02/igloo-cafe-1644255104.jpg', timings: '8am - 9pm' },
  { name: 'Pahalgam Cafe Wilo', cuisine: 'Continental & Local', price: 'Premium', location: 'Pahalgam Market', rating: 4.4, specialty: 'Trout Fish, BBQ', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/c2/cd/39/cafe-wilo.jpg?w=700&h=400&s=1', timings: '8am - 10pm' },
  { name: 'Winter Fell Cafe', cuisine: 'Traditional Kehwa House', price: 'Budget', location: 'Rajbagh, Srinagar', rating: 4.8, specialty: 'Kahwa Tea, MockTails', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2c/c3/41/eb/caption.jpg?w=400&h=-1&s=1', timings: '6am - 8pm' },
];

const vehicles = [
  { name: 'Innova Crysta', type: 'SUV', capacity: 7, pricePerDay: 3500, pricePerKm: 14, driver: true, image: 'https://charzanholidays.com/wp-content/uploads/2024/07/crysta-900x600.jpg', features: ['AC', 'Music', 'GPS'] },
  { name: 'Tata Sumo', type: 'SUV', capacity: 9, pricePerDay: 2800, pricePerKm: 12, driver: true, image: 'https://www.japjitravel.com/jap/media/gallery/tata-sumo-gold.jpg', features: ['AC', 'Extra Luggage'] },
  { name: 'Shikara Ride', type: 'Boat', capacity: 4, pricePerDay: 1200, pricePerKm: null, driver: true, image: 'https://www.carrentalsrinagar.com/wp-content/uploads/2023/06/Book-Shikara-Ride-in-Dal-Lake-1.webp', features: ['Decorated', 'Guide', 'Sunset Ride'] },
  { name: 'Luxury Mini Bus', type: 'Bus', capacity: 20, pricePerDay: 8000, pricePerKm: 20, driver: true, image: 'https://content.jdmagicbox.com/comp/patiala/e3/9999px175.x175.240428131151.s8e3/catalogue/jagdambay-bus-service-patiala-7z7bg3t4zg.jpg', features: ['AC', 'Reclining Seats', 'Guide'] },
];

const crops = [
  { name: 'Kashmiri Saffron', category: 'Spice', price: 450, unit: 'gram', seller: 'Abdul Rashid Farm', location: 'Pampore', image: 'https://d3kgrlupo77sg7.cloudfront.net/media/chococoorgspice.com/images/products/premium-kashmiri-saffron-1g-100-pure-grade-1-kesar-from.20240409012247.webp', organic: true, stock: 50, description: 'World-famous Pampore saffron, GI tagged, pure A-grade.' },
  { name: 'Kashmiri Apple', category: 'Fruit', price: 85, unit: 'kg', seller: 'Bashir Orchards', location: 'Sopore', image: 'https://tripmore.in/wp-content/uploads/2024/10/kashmiri-apple-500x500-1-1024x1024.jpg', organic: true, stock: 200, description: 'Crisp, sweet Maharaji and American apples from Sopore.' },
  { name: 'Walnuts (Doon)', category: 'Dry Fruit', price: 650, unit: 'kg', seller: 'Zargar Walnut Farm', location: 'Budgam', image: 'https://4.imimg.com/data4/NQ/UV/ANDROID-48588370/product-500x500.jpeg', organic: true, stock: 120, description: 'Paper-shell Kashmiri walnuts, rich in Omega-3.' },
  { name: 'Cherry (Gilgiti)', category: 'Fruit', price: 280, unit: 'kg', seller: 'Lone Cherry Farm', location: 'Srinagar', image: 'https://kashmirstore.in/wp-content/uploads/2016/12/Kashmiri-Cherry2.jpg', organic: true, stock: 80, description: 'Sweet dark Gilgiti cherries, season June-July.' },
  { name: 'Strawberry', category: 'Fruit', price: 120, unit: 'kg', seller: 'Shah Berry Farm', location: 'Sopore', image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&q=80', organic: true, stock: 60, description: 'Sweet aromatic strawberries from high-altitude farms.' },
  { name: 'Chillies', category: 'Spice', price: 120, unit: 'kg', seller: 'Shah Berry Farm', location: 'Sopore', image: 'https://gardeningcentre.in/cdn/shop/files/chilli-kashmiri.jpg?v=1738821247', organic: true, stock: 60, description: 'Fresh Kashmiri chillies from high-altitude farms.' },
];

const machines = [
  { name: 'Mahindra Tractor 575', type: 'Tractor', hp: 45, buyPrice: 680000, rentPerDay: 2500, image: 'https://assets.tractorjunction.com/tractor-junction/assets/images/tractor-images/tractor-image-0-1731604906.webp?width=538&height=320', available: true, owner: 'Malik Farm Rentals' },
  { name: 'Combined Harvester', type: 'Harvester', hp: 80, buyPrice: 1800000, rentPerDay: 8000, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRR_Le5rgbHLvP3T1GgOzzNZjhqcPRTu0osMw&s', available: true, owner: 'AgriTech Kashmir' },
  { name: 'Rotavator (7 ft)', type: 'Attachment', buyPrice: 85000, rentPerDay: 700, image: 'https://5.imimg.com/data5/SELLER/Default/2024/5/423345404/GI/AP/BE/88644821/spike-rotavator-agritron-500x500.jpg', available: true, owner: 'Farm Equipment Co.' },
  { name: 'Sprinkler Irrigation Set', type: 'Irrigation', buyPrice: 45000, rentPerDay: 400, image: 'https://5.imimg.com/data5/SELLER/Default/2024/5/415084128/FC/ZC/HS/2503855/sprinkler-irrigation-system.png', available: false, owner: 'Irrigation Depot' },
  { name: 'Potato Digger', type: 'Harvester', buyPrice: 120000, rentPerDay: 1200, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXwkdT7rGeQ-a6b7ggV8yu-upgskFg7yEqCQ&s', available: true, owner: 'Bhat Agri Solutions' },
  { name: 'Mini Power Tiller', type: 'Tiller', hp: 9, buyPrice: 95000, rentPerDay: 900, image: 'https://toolz4industry.com/wp-content/uploads/2023/05/power-gold-71cc-power-tiller-12.jpg', available: true, owner: 'SmallFarm Tools' },
];

module.exports = { hotels, restaurants, vehicles, crops, machines };

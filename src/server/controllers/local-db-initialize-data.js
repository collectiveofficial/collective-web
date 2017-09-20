const moment = require('moment-timezone');

module.exports.firstDropoff = {
  id: 1,
  intendedShipDate: '2017-08-26',
  intendedPickupTimeStart: moment.tz('2017-08-26 10:00:00', 'America/New_York'),
  intendedPickupTimeEnd: moment.tz('2017-08-26 13:00:00', 'America/New_York'),
  shipDate: null,
  voteDateTimeBeg: moment.tz('2017-08-11 00:00:00', 'America/New_York'),
  voteDateTimeEnd: moment.tz('2017-08-23 23:59:59', 'America/New_York'),
  pricePerDormPackage: 6,
  pricePerCookingPackage: 10,
  totalDormPackagesOrdered: 0,
  totalCookingPackagesOrdered: 0,
  totalDollarAmount: 0,
  pctFeePerPackage: 0.05,
  totalRevenueBeforeStripe: 0,
  totalRevenueAftereStripe: 0,
  // TODO: dynamic groupID
  groupID: 1,
};

module.exports.firstDropFoodItems = [{
  name: 'Sweet Potatoes',
  imageUrl: 'https://i2.wp.com/bonnieplants.com/wp-content/uploads/2011/10/sweet-potatoes-harvest.jpg?ssl=1',
},
{
  name: 'Potatoes',
  imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Patates.jpg',
},
{
  name: 'Kiwis',
  imageUrl: 'http://cdn.thealternativedaily.com/wp-content/uploads/2013/11/kiwi.jpg',
},
{
  name: 'Oranges',
  imageUrl: 'http://grapplergourmet.com/wp-content/uploads/2015/03/piles.jpg',
},
{
  name: 'Granny Smith Apples',
  imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Granny_smith.jpg/220px-Granny_smith.jpg',
},
{
  name: 'Golden Delicious Apples',
  imageUrl: 'https://sc01.alicdn.com/kf/UT88x55XFFaXXagOFbXL/Golden-Delicious-Apples-Best-Quality-and-best.jpg',
},
{
  name: 'Pink Lady Apples',
  imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQafjY4RXhQCk40caqUGSRtmzkK0hu_RQQ_zR1v3nWAkRSvvSgTsA',
},
{
  name: 'Bananas',
  imageUrl: 'https://timedotcom.files.wordpress.com/2017/05/amazonfreebananas-em-86304874.jpg?w=720',
},
{
  name: 'Red Grapes',
  imageUrl: 'https://blackmoonejuice.com/wp-content/uploads/2014/05/grapes.jpg',
},
{
  name: 'White Grapes',
  imageUrl: 'https://world-food-and-wine.com/image-files/white-grapes.jpg',
},
{
  name: 'Carrots',
  imageUrl: 'http://edge.alluremedia.com.au/uploads/businessinsider/2015/12/baby-carrots.jpg',
},
{
  name: 'Spinach',
  imageUrl: 'http://healthyrise.com/wp-content/uploads/2016/07/Spinach.jpg',
},
{
  name: 'Red Peppers',
  imageUrl: 'http://www.ibizeneco.com/communities/1/004/013/082/201/images/4621089873.jpg',
},
{
  name: 'Green Peppers',
  imageUrl: 'http://palmaworld.com/wp-content/uploads/2017/01/green-pepper.jpg',
}];

module.exports.secondDropoff = {
  id: 2,
  intendedShipDate: '2017-09-09',
  intendedPickupTimeStart: moment.tz('2017-09-09 09:00:00', 'America/New_York'),
  intendedPickupTimeEnd: moment.tz('2017-09-09 12:00:00', 'America/New_York'),
  shipDate: null,
  voteDateTimeBeg: moment.tz('2017-08-24 00:00:00', 'America/New_York'),
  voteDateTimeEnd: moment.tz('2017-09-06 23:59:59', 'America/New_York'),
  pricePerDormPackage: 6,
  pricePerCookingPackage: 10,
  totalDormPackagesOrdered: 0,
  totalCookingPackagesOrdered: 0,
  totalDollarAmount: 0,
  pctFeePerPackage: 0.05,
  totalRevenueBeforeStripe: 0,
  totalRevenueAftereStripe: 0,
  // TODO: dynamic groupID
  groupID: 1,
};

module.exports.secondDropFoodItems = [
  {
    name: 'Green Peppers',
    imageUrl: 'https://goo.gl/fyjxBH',
    // imageUrl: 'https://i.warosu.org/data/ck/img/0054/27/1399844907702.jpg',
  },
  {
    name: 'Honeydews',
    imageUrl: 'https://goo.gl/yBWwRM',
    // imageUrl: 'http://servingjoy.com/wp-content/uploads/2014/12/Slice-of-Honeydew-Melon.jpg',
  },
  {
    name: 'Papaya',
    imageUrl: 'https://goo.gl/UFxCQJ',
    // imageUrl: 'http://juicing-for-health.com/wp-content/uploads/2012/06/papaya1.jpg',
  },
  {
    name: 'Pears',
    imageUrl: 'https://goo.gl/KwwJ81',
    // imageUrl: 'http://www.liversupport.com/wp-content/uploads/2015/09/pears-can-assist-your-liver-999x576.jpg',
  },
  {
    name: 'Raspberries',
    imageUrl: 'https://goo.gl/FS3KJR',
    // imageUrl: 'http://wtop.com/wp-content/uploads/2017/06/raspberries-1880x1254.jpg',
  },
  {
    name: 'Watermelon',
    imageUrl: 'https://goo.gl/cSPZwi',
    // imageUrl: 'http://www.well-beingsecrets.com/wp-content/uploads/How-to-Buy-and-Store-Watermelon.jpg',
  },
  {
    name: 'Asparagus',
    imageUrl: 'https://goo.gl/GdYJ1D',
    // imageUrl: 'http://www.oahufresh.com/wp-content/uploads/2016/08/asparagus.jpg',
  },
  {
    name: 'Kiwi',
    imageUrl: 'https://goo.gl/bzMN3v',
    // imageUrl: 'https://aos.iacpublishinglabs.com/question/aq/1400px-788px/kiwi-citrus-fruit_2411b9e870d212a5.jpg?domain=cx.aos.ask.com',
  },
  {
    name: 'Cabbage',
    imageUrl: 'https://goo.gl/zYk9MV',
    // imageUrl: 'https://fthmb.tqn.com/_T98MEySnrgcOOK879GS7PvJBg0=/2000x1500/filters:no_upscale()/about/Cabbage-GettyImages-683732681-586599443df78ce2c32dd4c3.jpg',
  },
  {
    name: 'Kale',
    imageUrl: 'https://goo.gl/5QJdLK',
    // imageUrl: 'http://www.vegkitchen.com/wp-content/uploads/2012/12/Kale-in-a-basket.jpg',
  },
  {
    name: 'Collards',
    imageUrl: 'https://goo.gl/PaUpGv',
    // imageUrl: 'https://ronemyhoustonmajic.files.wordpress.com/2015/04/171305080.jpg',
  },
  {
    name: 'Cucumbers',
    imageUrl: 'https://goo.gl/UDqsdB',
    // imageUrl: 'http://www.movenoticias.com/wp-content/uploads/2017/06/pepino-fatiado.jpg',
  },
  {
    name: 'Tomato',
    imageUrl: 'https://goo.gl/XL4rzh',
    // imageUrl: 'http://ichef.bbci.co.uk/wwfeatures/wm/live/1280_640/images/live/p0/4w/46/p04w46sp.jpg',
  },
  {
    name: 'Corn',
    imageUrl: 'https://goo.gl/8SqA6z',
    // imageUrl: 'https://thumbs.mic.com/ODU4ODMwNjZlMiMvd2w1NjJaZFk4RnFkZDk3cW12bzFLejVoaUwwPS82MXgzNTY6NDIyN3gyNDkyLzE2MDB4OTAwL2ZpbHRlcnM6Zm9ybWF0KGpwZWcpOnF1YWxpdHkoODApL2h0dHBzOi8vczMuYW1hem9uYXdzLmNvbS9wb2xpY3ltaWMtaW1hZ2VzL3g3dzZtb2d2aHRnb21qYnNyZWhoc2x3YWY0OGgxY2UzOHdxcGRnZ254em12OXBxNnZnZGt4eDdvb2llZGxuNXUuanBn.jpg',
  },
  {
    name: 'Lettuce',
    imageUrl: 'https://goo.gl/7G9jB9',
    // imageUrl: 'http://s.eatthis-cdn.com/media/images/ext/724422176/napacabbage-healthier-than-kale.jpg',
  },
  {
    name: 'Apples',
    imageUrl: 'https://goo.gl/W6YmQZ',
    // imageUrl: 'http://www.ultrahdfreewallpapers.com/uploads/large/fruits/apple-fruit-hd-wallpaper-0041.jpg',
  },
  {
    name: 'Sweet Potatoes',
    imageUrl: 'https://goo.gl/jEiem5',
    // imageUrl: 'http://nutritionstudies.org/wp-content/uploads/2015/05/recipe-oh-so-sweet-potatoes.jpg',
  },
  {
    name: 'Oranges',
    imageUrl: 'https://goo.gl/ZAeoZD',
    // imageUrl: 'https://img.maximummedia.ie/her_ie/eyJkYXRhIjoie1widXJsXCI6XCJodHRwOlxcXC9cXFwvbWVkaWEtaGVyLm1heGltdW1tZWRpYS5pZS5zMy5hbWF6b25hd3MuY29tXFxcL3dwLWNvbnRlbnRcXFwvdXBsb2Fkc1xcXC8yMDE3XFxcLzAyXFxcLzIxMTUzOTI2XFxcL29yYW5nZXMuanBnXCIsXCJ3aWR0aFwiOjY0NyxcImhlaWdodFwiOjM0MCxcImRlZmF1bHRcIjpcImh0dHBzOlxcXC9cXFwvd3d3Lmhlci5pZVxcXC9hc3NldHNcXFwvaW1hZ2VzXFxcL2hlclxcXC9uby1pbWFnZS5wbmc_dj0zXCJ9IiwiaGFzaCI6ImZiMzYzNTI2YzhmYTI4OWI4YjY0MWFkODI5OGZjNzRkNjI1NTAwMzEifQ==/oranges.jpg',
  },
  {
    name: 'Bananas',
    imageUrl: 'https://goo.gl/VvMUcM',
    // imageUrl: 'https://timedotcom.files.wordpress.com/2017/05/amazonfreebananas-em-86304874.jpg?quality=85',
  },
];

module.exports.thirdDropoff = {
  id: 3,
  intendedShipDate: '2017-09-22',
  intendedPickupTimeStart: moment.tz('2017-09-22 08:00:00', 'America/New_York').format(),
  intendedPickupTimeEnd: moment.tz('2017-09-22 16:00:00', 'America/New_York').format(),
  shipDate: null,
  voteDateTimeBeg: moment.tz('2017-09-07 00:00:00', 'America/New_York').format(),
  voteDateTimeEnd: moment.tz('2017-09-20 23:59:59', 'America/New_York').format(),
  pricePerDormPackage: 6,
  pricePerCookingPackage: 11,
  totalDormPackagesOrdered: 0,
  totalCookingPackagesOrdered: 0,
  totalDollarAmount: 0,
  pctFeePerPackage: 0,
  totalRevenueBeforeStripe: 0,
  totalRevenueAftereStripe: 0,
  // TODO: dynamic groupID
  groupID: 1,
};


module.exports.thirdDropoffFoodItems = [
  {
    name: 'Apples',
    imageUrl: 'https://goo.gl/W6YmQZ',
  },
  {
    name: 'Asparagus',
    imageUrl: 'https://goo.gl/GdYJ1D',
  },
  {
    name: 'Avocado',
    imageUrl: 'https://goo.gl/r4CPYo',
  },
  {
    name: 'Bananas',
    imageUrl: 'https://goo.gl/VvMUcM',
  },
  {
    name: 'Cabbage',
    imageUrl: 'https://goo.gl/zYk9MV',
  },
  {
    name: 'Carrots',
    imageUrl: 'https://goo.gl/tKv14c',
  },
  {
    name: 'Collards',
    imageUrl: 'https://goo.gl/PaUpGv',
  },
  {
    name: 'Corn',
    imageUrl: 'https://goo.gl/8SqA6z',
  },
  {
    name: 'Cucumbers',
    imageUrl: 'https://goo.gl/UDqsdB',
  },
  {
    name: 'Green Peppers',
    imageUrl: 'https://goo.gl/fyjxBH',
  },
  {
    name: 'Kiwi',
    imageUrl: 'https://goo.gl/bzMN3v',
  },
  {
    name: 'Limes',
    imageUrl: 'https://goo.gl/LEqN1v',
  },
  {
    name: 'Oranges',
    imageUrl: 'https://goo.gl/ZAeoZD',
  },
  {
    name: 'Red Onion',
    imageUrl: 'https://goo.gl/iMbyHw',
  },
  {
    name: 'Romaine Lettuce',
    imageUrl: 'https://goo.gl/SC43h7',
  },
  {
    name: 'Spinach',
    imageUrl: 'https://goo.gl/unjadz',
  },
  {
    name: 'Sweet Potatoes',
    imageUrl: 'https://goo.gl/jEiem5',
  },
];

// this.state = {
//   date: "26 August 2017 from 9am to Noon",
//   vote: "Voting window is from 11 August at 12:00 AM to 23 August at 11:59 PM",
//   remainingCalendar: [
//   ['7 October 2017',  "Voting window is from 20 September at 12:00 AM to 4 October at 11:59 PM"],
//   ['28 October 2017',  "Voting window is from 5 October at 12:00 AM to 25 October at 11:59 PM"],
//   ['10 November 2017', "Voting window is from 26 October at 12:00 AM to 8 November at 11:59 PM"],
//   ['2 December 2017',  "Voting window is from 9 November at 12:00 AM to 29 November at 11:59 PM"]
//   ],
//   items: ['Apples', 'Bananas', 'Mangos', 'Sweet Potatoes', 'Pears', 'Potatoes', 'Kiwis', 'Oranges', 'Avocadoes'],
//   provider: "DNO Produce",
//   //label location as search query...for instance, if the location is Ohio Stadium, enter as as string "ohio+stadium+ohio+state" after q
//   location: "https://www.google.com/maps/embed/v1/place?key=AIzaSyAe4udSuEN363saUqTCKlCd1l64D9zST5o&q=scott+house+ohio+state+university",
// };

module.exports.fourthDropoff = {
  id: 4,
  intendedShipDate: '2017-10-07',
  intendedPickupTimeStart: moment.tz('2017-10-07 09:00:00', 'America/New_York').format(),
  intendedPickupTimeEnd: moment.tz('2017-10-07 12:00:00', 'America/New_York').format(),
  shipDate: null,
  voteDateTimeBeg: moment.tz('2017-09-20 00:00:00', 'America/New_York').format(),
  voteDateTimeEnd: moment.tz('2017-10-04 23:59:59', 'America/New_York').format(),
  pricePerDormPackage: 6,
  pricePerCookingPackage: 6,
  totalDormPackagesOrdered: 0,
  totalCookingPackagesOrdered: 0,
  totalDollarAmount: 0,
  pctFeePerPackage: 0,
  totalRevenueBeforeStripe: 0,
  totalRevenueAftereStripe: 0,
  // TODO: dynamic groupID
  groupID: 1,
};


module.exports.fourthDropoffFoodItems = [
  {
    name: 'Apples',
    imageUrl: 'https://goo.gl/W6YmQZ',
  },
  {
    name: 'Asparagus',
    imageUrl: 'https://goo.gl/GdYJ1D',
  },
  {
    name: 'Avocado',
    imageUrl: 'https://goo.gl/r4CPYo',
  },
  {
    name: 'Bananas',
    imageUrl: 'https://goo.gl/VvMUcM',
  },
  {
    name: 'Baby Brocolli',
    imageUrl: 'https://goo.gl/p3hLZk',
  },
  {
    name: 'Brussel Sprouts',
    imageUrl: 'https://goo.gl/TQgny8',
  },
  {
    name: 'Baby Carrots',
    imageUrl: 'https://goo.gl/tKv14c',
  },
  {
    name: 'Celery',
    imageUrl: 'https://goo.gl/xbZngk',
  },
  {
    name: 'Clementines',
    imageUrl: 'https://goo.gl/Wtxvqu',
  },
  {
    name: 'Lemons',
    imageUrl: 'https://goo.gl/JsK2kY',
  },
  {
    name: 'Limes',
    imageUrl: 'https://goo.gl/LEqN1v',
  },
  {
    name: 'Sweet Potatoes',
    imageUrl: 'https://goo.gl/jEiem5',
  },
  {
    name: 'Spinach',
    imageUrl: 'https://goo.gl/unjadz',
  },
];

module.exports.firstGroup = {
  name: 'Ohio State University, Columbus',
  type: 'university',
  streetAddress: '160 W Woodruff Ave',
  aptSuite: 'Building 1108',
  city: 'Columbus',
  state: 'OH',
  zipCode: '43210',
  descriptor: 'Best Food Forward is made for students by students, utilizing a democratic, cooperative framework to make it easier for people to eat healthy.',
  // TODO: dynamic dropoff ID (current datetime)
  currentDropoffID: 1,
  // TODO: dynamic voting dropoff ID (current datetime)
  currentVotingDropoffID: 1,
  deliveryStreetAddress: '160 W Woodruff Ave',
  deliveryAptSuite: 'Building 1108',
  deliveryCity: 'Columbus',
  deliveryState: 'OH',
  deliveryZipCode: '43210',
};

module.exports.restrictedAddresses = {
  'Archer House': {
    streetAddress: '2130 Neil Avenue',
    aptSuite: '',
    city: 'Columbus',
    state: 'OH',
    zipCode: '43210',
    restrictionType: 'university dorm',
  },
  'Baker Hall East': {
    streetAddress: '93 West 12th Avenue',
    aptSuite: '',
    city: 'Columbus',
    state: 'OH',
    zipCode: '43210',
    restrictionType: 'university dorm',
  },
  'Baker Hall West': {
    streetAddress: '129 West 12th Avenue',
    aptSuite: '',
    city: 'Columbus',
    state: 'OH',
    zipCode: '43210',
    restrictionType: 'university dorm',
  },
  'Barrett House': {
    streetAddress: '88 W. Woodruff Ave',
    aptSuite: '',
    city: 'Columbus',
    state: 'OH',
    zipCode: '43210',
    restrictionType: 'university dorm',
  },
  'Blackburn House': {
    streetAddress: '136 W. Woodruff Avenue',
    aptSuite: '',
    city: 'Columbus',
    state: 'OH',
    zipCode: '43210',
    restrictionType: 'university dorm',
  },
  'Bowen House': {
    streetAddress: '2125 N. High Street',
    aptSuite: '',
    city: 'Columbus',
    state: 'OH',
    zipCode: '43210',
    restrictionType: 'university dorm',
  },
  'Bradley Hall': {
    streetAddress: '221 West 12th Avenue',
    aptSuite: '',
    city: 'Columbus',
    state: 'OH',
    zipCode: '43210',
    restrictionType: 'university dorm',
  },
  'Busch House': {
    streetAddress: '2115 N. High Street',
    aptSuite: '',
    city: 'Columbus',
    state: 'OH',
    zipCode: '43210',
    restrictionType: 'university dorm',
  },
  'Canfield Hall': {
    streetAddress: '236 West 11th Avenue',
    aptSuite: '',
    city: 'Columbus',
    state: 'OH',
    zipCode: '43210',
    restrictionType: 'university dorm',
  },
  'Drackett Tower': {
    streetAddress: '191 W. Lane Avenue',
    aptSuite: '',
    city: 'Columbus',
    state: 'OH',
    zipCode: '43210',
    restrictionType: 'university dorm',
  },
  'Fechko House': {
    streetAddress: '220 West 11th Avenue',
    aptSuite: '',
    city: 'Columbus',
    state: 'OH',
    zipCode: '43210',
    restrictionType: 'university dorm',
  },
  'German House': {
    streetAddress: '141 West 11th Avenue',
    aptSuite: '',
    city: 'Columbus',
    state: 'OH',
    zipCode: '43201',
    restrictionType: 'university dorm',
  },
  'Hanley House': {
    streetAddress: '225 West 10th Avenue',
    aptSuite: '',
    city: 'Columbus',
    state: 'OH',
    zipCode: '43201',
    restrictionType: 'university dorm',
  },
  'Haverfield House': {
    streetAddress: '112 West Woodruff Avenue',
    aptSuite: '',
    city: 'Columbus',
    state: 'OH',
    zipCode: '43210',
    restrictionType: 'university dorm',
  },
  'Houck House': {
    streetAddress: '61 West Lane Avenue',
    aptSuite: '',
    city: 'Columbus',
    state: 'OH',
    zipCode: '43210',
    restrictionType: 'university dorm',
  },
  'Houston House': {
    streetAddress: '97 W. Lane Avenue',
    aptSuite: '',
    city: 'Columbus',
    state: 'OH',
    zipCode: '43210',
    restrictionType: 'university dorm',
  },
  'Jones Tower': {
    streetAddress: '123 W. Lane Ave',
    aptSuite: '',
    city: 'Columbus',
    state: 'OH',
    zipCode: '43210',
    restrictionType: 'university dorm',
  },
  'Lawrence Tower': {
    streetAddress: '328 West Lane Avenue',
    aptSuite: '',
    city: 'Columbus',
    state: 'OH',
    zipCode: '43210',
    restrictionType: 'university dorm',
  },
  'Lincoln House': {
    streetAddress: '1810 Cannon Drive West',
    aptSuite: '',
    city: 'Columbus',
    state: 'OH',
    zipCode: '43210',
    restrictionType: 'university dorm',
  },
  'Mack Hall': {
    streetAddress: '1698 Neil Avenue',
    aptSuite: '',
    city: 'Columbus',
    state: 'OH',
    zipCode: '43210',
    restrictionType: 'university dorm',
  },
  'Mendoza House': {
    streetAddress: '194 West Woodruff Ave.',
    aptSuite: '',
    city: 'Columbus',
    state: 'OH',
    zipCode: '43210',
    restrictionType: 'university dorm',
  },
  'Morrill Tower': {
    streetAddress: '1900 Cannon Drive West',
    aptSuite: '',
    city: 'Columbus',
    state: 'OH',
    zipCode: '43210',
    restrictionType: 'university dorm',
  },
  'Morrison Tower': {
    streetAddress: '196 West 11th Ave.',
    aptSuite: '',
    city: 'Columbus',
    state: 'OH',
    zipCode: '43210',
    restrictionType: 'university dorm',
  },
  'Neil Avenue': {
    streetAddress: '1578 Neil Avenue',
    aptSuite: '',
    city: 'Columbus',
    state: 'OH',
    zipCode: '43201',
    restrictionType: 'university dorm',
  },
  'Norton House': {
    streetAddress: '2114 Neil Avenue',
    aptSuite: '',
    city: 'Columbus',
    state: 'OH',
    zipCode: '43210',
    restrictionType: 'university dorm',
  },
  'Nosker House': {
    streetAddress: '124 West Woodruff Avenue',
    aptSuite: '',
    city: 'Columbus',
    state: 'OH',
    zipCode: '43210',
    restrictionType: 'university dorm',
  },
  'Park-Stradley Hall': {
    streetAddress: '120 West 11th Avenue',
    aptSuite: '',
    city: 'Columbus',
    state: 'OH',
    zipCode: '43210',
    restrictionType: 'university dorm',
  },
  'Paterson Hall': {
    streetAddress: '191 West 12th Ave.',
    aptSuite: '',
    city: 'Columbus',
    state: 'OH',
    zipCode: '43210',
    restrictionType: 'university dorm',
  },
  'Pennsylvania Place': {
    streetAddress: '1478 Pennsylvania Avenue',
    aptSuite: '',
    city: 'Columbus',
    state: 'OH',
    zipCode: '43201',
    restrictionType: 'university dorm',
  },
  'Pomerene House': {
    streetAddress: '231 West 10th Avenue',
    aptSuite: '',
    city: 'Columbus',
    state: 'OH',
    zipCode: '43201',
    restrictionType: 'university dorm',
  },
  'Raney House': {
    streetAddress: '33 W. Lane Avenue',
    aptSuite: '',
    city: 'Columbus',
    state: 'OH',
    zipCode: '43210',
    restrictionType: 'university dorm',
  },
  'Scholars East': {
    streetAddress: '221 West 10th Avenue',
    aptSuite: '',
    city: 'Columbus',
    state: 'OH',
    zipCode: '43201',
    restrictionType: 'university dorm',
  },
  'Scholars West': {
    streetAddress: '239 West 10th Avenue',
    aptSuite: '',
    city: 'Columbus',
    state: 'OH',
    zipCode: '43201',
    restrictionType: 'university dorm',
  },
  'Scott House': {
    streetAddress: '160 W. Woodruff Avenue',
    aptSuite: '',
    city: 'Columbus',
    state: 'OH',
    zipCode: '43210',
    restrictionType: 'university dorm',
  },
  'Siebert Hall': {
    streetAddress: '184 West 11th Ave.',
    aptSuite: '',
    city: 'Columbus',
    state: 'OH',
    zipCode: '43210',
    restrictionType: 'university dorm',
  },
  'Smith-Steeb Hall': {
    streetAddress: '80 West 11th Avenue',
    aptSuite: '',
    city: 'Columbus',
    state: 'OH',
    zipCode: '43210',
    restrictionType: 'university dorm',
  },
  'Taylor Tower': {
    streetAddress: '55 W. Lane Ave',
    aptSuite: '',
    city: 'Columbus',
    state: 'OH',
    zipCode: '43210',
    restrictionType: 'university dorm',
  },
  'The Residence on Tenth': {
    streetAddress: '230 West 10th Avenue',
    aptSuite: '',
    city: 'Columbus',
    state: 'OH',
    zipCode: '43201',
    restrictionType: 'university dorm',
  },
  'Torres House': {
    streetAddress: '187 W. Lane Avenue',
    aptSuite: '',
    city: 'Columbus',
    state: 'OH',
    zipCode: '43210',
    restrictionType: 'university dorm',
  },
  'Veteran\'s House': {
    streetAddress: '237 E 17th Ave',
    aptSuite: '',
    city: 'Columbus',
    state: 'OH',
    zipCode: '43201',
    restrictionType: 'university dorm',
  },
  'Worthington Building': {
    streetAddress: '203 West 10th Avenue',
    aptSuite: '',
    city: 'Columbus',
    state: 'OH',
    zipCode: '43201',
    restrictionType: 'university dorm',
  },
};

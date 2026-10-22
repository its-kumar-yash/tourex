-- Seed: 8 sample packages for Desi Tours and Travels.
-- Photos are Unsplash placeholders; replace them from the admin dashboard.
-- Prices are per person in INR minor units (paise).

insert into public.packages
  (id, slug, title, summary, description, location, country, price_minor, currency,
   duration_days, max_guests, rating, cover_image_url, is_featured, is_published)
values
  ('00000000-0000-4000-8000-000000000001', 'kerala-backwaters-houseboat',
   'Kerala Backwaters Houseboat',
   'Drift through Alleppey''s palm-lined canals on a private houseboat with home-cooked Kerala meals.',
   'Five slow days in God''s Own Country. Board a traditional kettuvallam houseboat in Alleppey, cruise the backwaters past rice paddies and village jetties, and sleep on the water under the stars. Includes an Ayurvedic spa afternoon, a Kathakali performance in Kochi and all meals on board.',
   'Alleppey, Kerala', 'India', 2499900, 'INR', 5, 6, 4.8,
   'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1600&q=80', true, true),

  ('00000000-0000-4000-8000-000000000002', 'ladakh-himalayan-road-trip',
   'Ladakh Himalayan Road Trip',
   'Leh, Nubra Valley and Pangong Lake by road, with two nights under some of the clearest skies on earth.',
   'A seven-day high-altitude circuit through Ladakh. Acclimatise in Leh, cross Khardung La to the sand dunes of Nubra, camp beside the blue of Pangong Tso and return via the monasteries of Thiksey and Hemis. Oxygen support, an experienced mountain driver and all permits included.',
   'Leh, Ladakh', 'India', 3850000, 'INR', 7, 8, 4.9,
   'https://images.unsplash.com/photo-1581791534721-e599df4417f7?w=1600&q=80', true, true),

  ('00000000-0000-4000-8000-000000000003', 'goa-beach-escape',
   'Goa Beach Escape',
   'Four easy days of beaches, Portuguese quarters and sunset cruises in North Goa.',
   'Stay a short walk from Vagator beach, explore the heritage lanes of Fontainhas, take a sunset cruise on the Mandovi and spend an afternoon at the Saturday night market. Scooter rental, a spice-plantation lunch and airport transfers are included.',
   'North Goa', 'India', 1599900, 'INR', 4, 6, 4.6,
   'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1600&q=80', false, true),

  ('00000000-0000-4000-8000-000000000004', 'royal-rajasthan-jaipur',
   'Royal Rajasthan: Jaipur and Beyond',
   'Palaces, forts and bazaars of the Pink City, with a desert night at a heritage haveli.',
   'Five days through Rajasthan''s royal past. Amber Fort by elephant-free jeep, Hawa Mahal at sunrise, a block-printing workshop in Sanganer and a night in a restored haveli outside the city with folk music under the stars.',
   'Jaipur, Rajasthan', 'India', 2149900, 'INR', 5, 8, 4.7,
   'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1600&q=80', false, true),

  ('00000000-0000-4000-8000-000000000005', 'agra-taj-mahal-heritage',
   'Agra Taj Mahal Heritage',
   'A two-day heritage break: the Taj at sunrise, Agra Fort and the ghost city of Fatehpur Sikri.',
   'Travel by express train from Delhi, watch the Taj Mahal change colour at dawn with a licensed guide, walk the red sandstone halls of Agra Fort and end at Fatehpur Sikri before returning. Train tickets, monument entry and a Mughlai dinner included.',
   'Agra, Uttar Pradesh', 'India', 899900, 'INR', 2, 10, 4.5,
   'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1600&q=80', false, true),

  ('00000000-0000-4000-8000-000000000006', 'mount-bromo-sunrise-trek',
   'Mount Bromo Sunrise Trek',
   'A jeep ride across the Sea of Sand and sunrise above the smoking crater of Bromo.',
   'Four days in East Java. Fly into Surabaya, overnight in Cemoro Lawang, rise at 3am for the sunrise viewpoint at Penanjakan, cross the volcanic sand sea by jeep and climb the crater rim. Includes a day at the Madakaripura waterfall and all transfers.',
   'East Java', 'Indonesia', 4200000, 'INR', 4, 6, 4.8,
   'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=1600&q=80', true, true),

  ('00000000-0000-4000-8000-000000000007', 'mount-fuji-and-kyoto',
   'Mount Fuji and Kyoto',
   'Six days from Tokyo to Kyoto with a night at a lakeside ryokan facing Fuji-san.',
   'The classic Japan route done properly. Two nights in Tokyo, a ryokan stay at Lake Kawaguchi with Fuji views and an onsen, then the bullet train to Kyoto for Fushimi Inari, Arashiyama bamboo grove and a tea ceremony in Gion. JR pass and all hotels included.',
   'Yamanashi and Kyoto', 'Japan', 11500000, 'INR', 6, 6, 4.9,
   'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=1600&q=80', false, true),

  ('00000000-0000-4000-8000-000000000008', 'raja-ampat-island-hopping',
   'Raja Ampat Island Hopping',
   'Six days of snorkelling and island hopping in the richest reefs on the planet.',
   'Fly to Sorong and boat out to a homestay on Kri Island. Snorkel with manta rays at Manta Sandy, climb the Piaynemo viewpoint over the karst islands, kayak the mangroves and watch birds of paradise at dawn. Boat transfers, snorkel gear and full board included.',
   'West Papua', 'Indonesia', 9800000, 'INR', 6, 4, 4.9,
   'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?w=1600&q=80', false, true)
on conflict (id) do nothing;

insert into public.package_images (package_id, url, alt, sort_order) values
  ('00000000-0000-4000-8000-000000000001', 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1600&q=80', 'Houseboat on the Kerala backwaters', 0),
  ('00000000-0000-4000-8000-000000000001', 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=1600&q=80', 'Palm-lined canal in Alleppey', 1),
  ('00000000-0000-4000-8000-000000000002', 'https://images.unsplash.com/photo-1581791534721-e599df4417f7?w=1600&q=80', 'Mountain road in Ladakh', 0),
  ('00000000-0000-4000-8000-000000000003', 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1600&q=80', 'Goa beach at sunset', 0),
  ('00000000-0000-4000-8000-000000000003', 'https://images.unsplash.com/photo-1587922546307-776227941871?w=1600&q=80', 'Palm trees on a Goa beach', 1),
  ('00000000-0000-4000-8000-000000000004', 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1600&q=80', 'Palace architecture in Jaipur', 0),
  ('00000000-0000-4000-8000-000000000004', 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1600&q=80', 'Jaipur city view', 1),
  ('00000000-0000-4000-8000-000000000005', 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1600&q=80', 'Taj Mahal at dawn', 0),
  ('00000000-0000-4000-8000-000000000005', 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1600&q=80', 'Taj Mahal from the gardens', 1),
  ('00000000-0000-4000-8000-000000000006', 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=1600&q=80', 'Mount Bromo crater at sunrise', 0),
  ('00000000-0000-4000-8000-000000000006', 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=1600&q=80', 'Volcanic landscape of East Java', 1),
  ('00000000-0000-4000-8000-000000000006', 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1600&q=80', 'Rice terraces in Indonesia', 2),
  ('00000000-0000-4000-8000-000000000007', 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=1600&q=80', 'Mount Fuji with Chureito pagoda', 0),
  ('00000000-0000-4000-8000-000000000007', 'https://images.unsplash.com/photo-1578469550956-0e16b69c6a3d?w=1600&q=80', 'Mount Fuji over a lake', 1),
  ('00000000-0000-4000-8000-000000000007', 'https://images.unsplash.com/photo-1570459027562-4a916cc6113f?w=1600&q=80', 'Kyoto street scene', 2),
  ('00000000-0000-4000-8000-000000000008', 'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?w=1600&q=80', 'Karst islands of Raja Ampat', 0),
  ('00000000-0000-4000-8000-000000000008', 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1600&q=80', 'Turquoise lagoon in Raja Ampat', 1),
  ('00000000-0000-4000-8000-000000000008', 'https://images.unsplash.com/photo-1559628233-100c798642d4?w=1600&q=80', 'Boat over a coral reef', 2);

insert into public.package_itinerary (package_id, day_no, title, description) values
  ('00000000-0000-4000-8000-000000000001', 1, 'Arrive in Kochi', 'Airport pickup, Fort Kochi walk and an evening Kathakali performance.'),
  ('00000000-0000-4000-8000-000000000001', 2, 'Board the houseboat', 'Drive to Alleppey, board after lunch and cruise to a village mooring for the night.'),
  ('00000000-0000-4000-8000-000000000001', 3, 'Backwater villages', 'Canoe through narrow canals, visit a coir-making family and a toddy shop.'),
  ('00000000-0000-4000-8000-000000000001', 4, 'Ayurveda and the beach', 'Disembark for a spa afternoon and sunset at Marari beach.'),
  ('00000000-0000-4000-8000-000000000001', 5, 'Departure', 'Breakfast and transfer to Kochi airport.'),

  ('00000000-0000-4000-8000-000000000002', 1, 'Arrive in Leh', 'Rest day for acclimatisation at 3,500 m. Short walk to Shanti Stupa at sunset.'),
  ('00000000-0000-4000-8000-000000000002', 2, 'Leh monasteries', 'Thiksey, Hemis and Shey palace. Evening in Leh market.'),
  ('00000000-0000-4000-8000-000000000002', 3, 'Khardung La to Nubra', 'Cross one of the highest motorable passes and camel ride at the Hunder dunes.'),
  ('00000000-0000-4000-8000-000000000002', 4, 'Nubra to Pangong', 'Drive via Shyok to Pangong Tso. Lakeside camp.'),
  ('00000000-0000-4000-8000-000000000002', 5, 'Pangong sunrise', 'Morning at the lake, then over Chang La back to Leh.'),
  ('00000000-0000-4000-8000-000000000002', 6, 'Magnetic Hill and Alchi', 'Sangam viewpoint, Magnetic Hill and the 11th-century murals at Alchi.'),
  ('00000000-0000-4000-8000-000000000002', 7, 'Departure', 'Transfer to Leh airport.'),

  ('00000000-0000-4000-8000-000000000003', 1, 'Arrive in Goa', 'Transfer to Vagator, scooter handover and sunset at Chapora fort.'),
  ('00000000-0000-4000-8000-000000000003', 2, 'Old Goa and Panjim', 'Basilica of Bom Jesus, Fontainhas heritage walk and a Mandovi sunset cruise.'),
  ('00000000-0000-4000-8000-000000000003', 3, 'Spice plantation and markets', 'Plantation lunch, then the Saturday night market at Arpora.'),
  ('00000000-0000-4000-8000-000000000003', 4, 'Departure', 'Beach morning and airport transfer.'),

  ('00000000-0000-4000-8000-000000000004', 1, 'Arrive in Jaipur', 'City Palace and the Jantar Mantar observatory.'),
  ('00000000-0000-4000-8000-000000000004', 2, 'Amber Fort', 'Jeep up to Amber, Panna Meena stepwell and Jal Mahal at dusk.'),
  ('00000000-0000-4000-8000-000000000004', 3, 'Hawa Mahal and bazaars', 'Sunrise at Hawa Mahal, block printing in Sanganer, Johari bazaar.'),
  ('00000000-0000-4000-8000-000000000004', 4, 'Heritage haveli', 'Drive out to a restored haveli, folk music and dinner under the stars.'),
  ('00000000-0000-4000-8000-000000000004', 5, 'Departure', 'Return to Jaipur for your onward journey.'),

  ('00000000-0000-4000-8000-000000000005', 1, 'Delhi to Agra', 'Morning express train, Agra Fort and Mehtab Bagh for a sunset view of the Taj.'),
  ('00000000-0000-4000-8000-000000000005', 2, 'Taj Mahal and Fatehpur Sikri', 'Sunrise entry with a guide, then Fatehpur Sikri and the evening train back.'),

  ('00000000-0000-4000-8000-000000000006', 1, 'Arrive in Surabaya', 'Transfer to Cemoro Lawang on the crater rim.'),
  ('00000000-0000-4000-8000-000000000006', 2, 'Bromo sunrise', '3am jeep to Penanjakan, cross the Sea of Sand and climb to the crater.'),
  ('00000000-0000-4000-8000-000000000006', 3, 'Madakaripura waterfall', 'Trek to the waterfall and an afternoon in Malang.'),
  ('00000000-0000-4000-8000-000000000006', 4, 'Departure', 'Transfer to Surabaya airport.'),

  ('00000000-0000-4000-8000-000000000007', 1, 'Arrive in Tokyo', 'Shibuya, Meiji shrine and an izakaya dinner.'),
  ('00000000-0000-4000-8000-000000000007', 2, 'Tokyo', 'Tsukiji outer market, Asakusa and teamLab.'),
  ('00000000-0000-4000-8000-000000000007', 3, 'Lake Kawaguchi', 'Bus to Kawaguchiko, Chureito pagoda and a ryokan night with onsen.'),
  ('00000000-0000-4000-8000-000000000007', 4, 'Bullet train to Kyoto', 'Fushimi Inari in the late afternoon, evening in Gion.'),
  ('00000000-0000-4000-8000-000000000007', 5, 'Kyoto', 'Arashiyama bamboo grove, Kinkaku-ji and a tea ceremony.'),
  ('00000000-0000-4000-8000-000000000007', 6, 'Departure', 'Transfer to Kansai airport.'),

  ('00000000-0000-4000-8000-000000000008', 1, 'Sorong to Kri Island', 'Boat transfer to the homestay and a house-reef snorkel.'),
  ('00000000-0000-4000-8000-000000000008', 2, 'Manta Sandy', 'Snorkel with manta rays and lunch on a sandbar.'),
  ('00000000-0000-4000-8000-000000000008', 3, 'Piaynemo', 'Climb the viewpoint over the karst islands and swim in the hidden lagoon.'),
  ('00000000-0000-4000-8000-000000000008', 4, 'Birds of paradise', 'Dawn hike to see the red bird of paradise, afternoon kayaking.'),
  ('00000000-0000-4000-8000-000000000008', 5, 'Arborek village', 'Village visit and jetty snorkel with schooling fish.'),
  ('00000000-0000-4000-8000-000000000008', 6, 'Departure', 'Boat back to Sorong for your flight.');

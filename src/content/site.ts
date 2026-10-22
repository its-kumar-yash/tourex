/** Marketing copy. Edit freely; nothing here is read from the database. */
export const site = {
  hero: {
    kicker: "अतिथि देवो भव",
    kickerMeaning: "Guests are like family",
    title: ["Let’s find your", "next yatra"],
    subtitle:
      "Hand-picked tours across India and beyond, led by local guides who know every gali, ghat and mountain road.",
  },
  about: {
    kicker: "हमारी कहानी",
    title: "Travel that brings you closer to people, places and memories",
    body: "We are a desi travel company. Every itinerary is planned by people who have travelled it themselves, with honest rupee pricing and no hidden extras.",
    stats: [
      { value: "97%", label: "Happy travellers" },
      { value: "85+", label: "Destinations" },
      { value: "245+", label: "Local guides" },
    ],
  },
  features: [
    { title: "Local guides", body: "Guides from the region who show you the places only locals know.", icon: "guide" },
    { title: "Desi hospitality", body: "Home-style food, warm stays and a team that treats you like family.", icon: "heart" },
    { title: "Honest ₹ pricing", body: "One clear per-person price. No hidden charges, no surprises.", icon: "rupee" },
    { title: "Safe and reliable", body: "Verified stays and drivers, and help on call from pickup to drop.", icon: "shield" },
  ],
  cta: {
    kicker: "चलो घूमने चलें",
    title: "Ready for your next yatra?",
    body: "Tell us where you want to go. We will plan the rest, from the first chai to the last sunset.",
  },
  contact: {
    email: "hello@desitoursandtravels.example",
    phone: "+91 98765 43210",
    whatsapp: "919876543210",
    address: "Desi Tours and Travels, Connaught Place, New Delhi 110001, India",
    hours: "Mon–Sat, 9:30 am to 7:00 pm IST",
  },
} as const;

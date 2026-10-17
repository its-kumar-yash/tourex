/** Marketing copy. Edit freely; nothing here is read from the database. */
export const site = {
  hero: {
    title: ["Let’s find your", "next adventure"],
    subtitle:
      "Hand-picked tour packages across India and beyond, with local guides who know every turn of the road.",
  },
  statement: "Take the step and explore the world waiting for you.",
  about: {
    title: "Traveling brings you closer to new places, people, and memories",
    body: "Traveling changes you. You see new places, meet new people, and become a new version of yourself.",
    stats: [
      { value: "97%", label: "Customer satisfaction" },
      { value: "85+", label: "Popular destinations" },
      { value: "245+", label: "Experienced guides" },
    ],
  },
  features: [
    {
      title: "Ease of travel",
      body: "Make your holiday trip easy and comfortable with a professional team handling every detail.",
      icon: "route",
    },
    {
      title: "Local staff help",
      body: "Professional local guides so you will not miss the hidden places only locals know.",
      icon: "guide",
    },
    {
      title: "Safe and reliable",
      body: "Experienced and professional team; your safety is guaranteed from pickup to drop.",
      icon: "shield",
    },
  ],
  cta: {
    title: "Get a good travel experience",
    body: "A good travel experience is not just about the places visited, but also the stories and lessons brought back home.",
  },
  contact: {
    email: "hello@desitoursandtravels.example",
    phone: "+91 98765 43210",
    address: "Desi Tours and Travels, New Delhi, India",
  },
} as const;

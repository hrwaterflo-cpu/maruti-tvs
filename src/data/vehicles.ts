export interface Vehicle {
  id: string;
  name: string;
  tagline: string;
  category: "Scooter" | "Electric" | "Sport Scooter";
  engine: string;
  mileage: string;
  price: string;
  image: string;
  badge?: string;
  highlights: string[];
}

export const VEHICLES: Vehicle[] = [
  {
    id: "scooty-streak",
    name: "TVS Scooty Streak",
    tagline: "Lightweight, agile & effortless city commuter with full genuine parts support.",
    category: "Scooter",
    engine: "87.8 cc, 4-Stroke",
    mileage: "62 km/l",
    price: "₹64,900*",
    image: "/images/scooty-streak.png",
    badge: "Full Parts Catalogue Live",
    highlights: ["External Fuel Fill", "Mobile Charger Socket", "Easy Center Stand"],
  },
  {
    id: "jupiter-125",
    name: "TVS Jupiter 125",
    tagline: "Zyada ka Fayda — Segment-largest 33L under-seat storage & unmatched comfort.",
    category: "Scooter",
    engine: "124.8 cc, ETFi",
    mileage: "57 km/l",
    price: "₹86,400*",
    image: "/images/jupiter-125.png",
    badge: "Best Seller",
    highlights: ["33L Boot Space", "Front Fuel Fill", "LED Headlamp"],
  },
  {
    id: "ntorq-125",
    name: "TVS Ntorq 125 Race XP",
    tagline: "India's first Bluetooth-connected performance scooter with dual ride modes.",
    category: "Sport Scooter",
    engine: "124.8 cc, 3-Valve",
    mileage: "51 km/l",
    price: "₹97,500*",
    image: "/images/ntorq-125.png",
    badge: "Performance",
    highlights: ["SmartXonnect", "Race & Street Modes", "Signature T-LED DRL"],
  },
  {
    id: "iqube-ev",
    name: "TVS iQube Electric",
    tagline: "Silent, smart, zero-emission urban mobility with fast home charging.",
    category: "Electric",
    engine: "4.4 kW Hub Motor",
    mileage: "100 km/charge",
    price: "₹1,07,000*",
    image: "/images/iqube-ev.png",
    badge: "Electric EV",
    highlights: ["TFT Smart Cluster", "Reverse Park Assist", "IP67 Battery Pack"],
  },
];

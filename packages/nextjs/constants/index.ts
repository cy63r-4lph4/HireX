import {
  Baby,
  Box,
  Car,
  ChefHat,
  Clock,
  Dog,
  GraduationCap,
  Hammer,
  Leaf,
  Lightbulb,
  MapPin,
  Paintbrush,
  Scissors,
  Shield,
  Wrench,
  Zap,
} from "lucide-react";

export const SERVICES = [
  { icon: Wrench, name: "Electricians", color: "from-yellow-500 to-orange-500" },
  { icon: Paintbrush, name: "Plumbers", color: "from-blue-500 to-cyan-500" },
  { icon: Car, name: "Drivers", color: "from-green-500 to-emerald-500" },
  { icon: ChefHat, name: "Cooks", color: "from-red-500 to-pink-500" },
  { icon: Scissors, name: "Seamstress", color: "from-purple-500 to-violet-500" },
  { icon: Lightbulb, name: "Cleaners", color: "from-indigo-500 to-blue-500" },
  { icon: Hammer, name: "Handyman", color: "from-orange-500 to-red-500" },
  { icon: Leaf, name: "Gardeners", color: "from-lime-500 to-green-500" },
  { icon: Dog, name: "Pet Sitters", color: "from-amber-500 to-yellow-500" },
  { icon: GraduationCap, name: "Tutors", color: "from-cyan-500 to-sky-500" },
  { icon: Baby, name: "Babysitters", color: "from-pink-500 to-rose-500" },
  { icon: Box, name: "Movers", color: "from-slate-500 to-gray-500" },
];

export const FEATURES = [
  {
    icon: MapPin,
    title: "GPS Location Tracking",
    description: "Find tasks and workers near you with precise GPS integration",
  },
  {
    icon: Clock,
    title: "Flexible Scheduling",
    description: "Choose between on-site visits or workshop appointments",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Safe transactions using CØRE cryptocurrency tokens",
  },
  {
    icon: Zap,
    title: "Instant Matching",
    description: "AI-powered matching system for quick task completion",
  },
];

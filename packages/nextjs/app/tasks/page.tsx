// "use client";

// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import Head from "next/head";
// import Link from "next/link";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import Navigation from "@/components/Navigation";
// import {
//   Search,
//   MapPin,
//   Clock,
//   Star,
//   Wrench,
//   Paintbrush,
//   Car,
//   ChefHat,
//   Scissors,
//   Lightbulb,
// } from "lucide-react";

// export default function FindTasksPage() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [selectedLocation, setSelectedLocation] = useState("all");
//   const [tasks, setTasks] = useState<any[]>([]);

//   // Mock tasks
//   const mockTasks = [
//     {
//       id: 1,
//       title: "Fix Kitchen Electrical Outlet",
//       description:
//         "Need an electrician to fix a faulty outlet in my kitchen. The outlet stopped working yesterday.",
//       category: "electrician",
//       location: "Downtown",
//       budget: 150,
//       timeEstimate: "2-3 hours",
//       urgency: "high",
//       serviceType: "on-site",
//       rating: 4.8,
//       reviews: 23,
//       postedBy: "Sarah M.",
//       postedTime: "2 hours ago",
//       skills: ["Electrical Repair", "Safety Certified"],
//     },
//     {
//       id: 2,
//       title: "Bathroom Pipe Leak Repair",
//       description:
//         "Urgent plumbing issue - pipe leak under bathroom sink needs immediate attention.",
//       category: "plumber",
//       location: "Midtown",
//       budget: 200,
//       timeEstimate: "1-2 hours",
//       urgency: "urgent",
//       serviceType: "on-site",
//       rating: 4.9,
//       reviews: 45,
//       postedBy: "Mike R.",
//       postedTime: "30 minutes ago",
//       skills: ["Emergency Plumbing", "Licensed"],
//     },
//     // ... (other tasks)
//   ];

//   const categories = [
//     { value: "all", label: "All Categories", icon: Search },
//     { value: "electrician", label: "Electricians", icon: Wrench },
//     { value: "plumber", label: "Plumbers", icon: Paintbrush },
//     { value: "driver", label: "Drivers", icon: Car },
//     { value: "cook", label: "Cooks", icon: ChefHat },
//     { value: "seamstress", label: "Seamstress", icon: Scissors },
//     { value: "cleaner", label: "Cleaners", icon: Lightbulb },
//   ];

//   const locations = [
//     { value: "all", label: "All Locations" },
//     { value: "downtown", label: "Downtown" },
//     { value: "midtown", label: "Midtown" },
//     { value: "uptown", label: "Uptown" },
//     { value: "brooklyn", label: "Brooklyn" },
//     { value: "airport", label: "Airport Area" },
//   ];

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const savedTasks = localStorage.getItem("hirex_tasks");
//       if (savedTasks) {
//         setTasks(JSON.parse(savedTasks));
//       } else {
//         setTasks(mockTasks);
//         localStorage.setItem("hirex_tasks", JSON.stringify(mockTasks));
//       }
//     }
//   }, []);

//   const filteredTasks = tasks.filter((task) => {
//     const matchesSearch =
//       task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       task.description.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCategory =
//       selectedCategory === "all" || task.category === selectedCategory;
//     const matchesLocation =
//       selectedLocation === "all" ||
//       task.location.toLowerCase().includes(selectedLocation.toLowerCase());

//     return matchesSearch && matchesCategory && matchesLocation;
//   });

//   const getUrgencyColor = (urgency: string) => {
//     switch (urgency) {
//       case "urgent":
//         return "bg-red-500/20 text-red-400 border-red-500/30";
//       case "high":
//         return "bg-orange-500/20 text-orange-400 border-orange-500/30";
//       case "medium":
//         return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
//       case "low":
//         return "bg-green-500/20 text-green-400 border-green-500/30";
//       default:
//         return "bg-gray-500/20 text-gray-400 border-gray-500/30";
//     }
//   };

//   const getCategoryIcon = (category: string) => {
//     const categoryData = categories.find((cat) => cat.value === category);
//     return categoryData ? categoryData.icon : Search;
//   };

//   return (
//     <>
//       <Head>
//         <title>
//           Find Tasks - HireX | Discover Local Service Opportunities
//         </title>
//         <meta
//           name="description"
//           content="Browse available tasks on HireX. Find electrician, plumber, cook, driver, and other service opportunities near you. Earn CØRE tokens for your skills."
//         />
//       </Head>

//       <div className="min-h-screen">
//         <Navigation />

//         <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
//           <div className="max-w-7xl mx-auto">
//             {/* Header */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6 }}
//               className="text-center mb-12"
//             >
//               <h1 className="text-4xl md:text-5xl font-orbitron font-bold gradient-text mb-4">
//                 Find Tasks
//               </h1>
//               <p className="text-xl text-gray-300 max-w-2xl mx-auto">
//                 Discover opportunities to earn{" "}
//                 <span className="core-token">CØRE</span> tokens by providing
//                 your skills and services
//               </p>
//             </motion.div>

//             {/* Search + Filters */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.1 }}
//               className="glass-effect rounded-xl p-6 mb-8 border border-white/20"
//             >
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                 {/* Search Input */}
//                 <div className="md:col-span-2">
//                   <div className="relative">
//                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//                     <Input
//                       placeholder="Search tasks..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
//                     />
//                   </div>
//                 </div>

//                 {/* Category Filter */}
//                 <Select
//                   value={selectedCategory}
//                   onValueChange={setSelectedCategory}
//                 >
//                   <SelectTrigger className="bg-white/10 border-white/20 text-white">
//                     <SelectValue placeholder="Category" />
//                   </SelectTrigger>
//                   <SelectContent className="bg-slate-800 border-white/20">
//                     {categories.map((category) => (
//                       <SelectItem
//                         key={category.value}
//                         value={category.value}
//                         className="text-white hover:bg-white/10"
//                       >
//                         {category.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>

//                 {/* Location Filter */}
//                 <Select
//                   value={selectedLocation}
//                   onValueChange={setSelectedLocation}
//                 >
//                   <SelectTrigger className="bg-white/10 border-white/20 text-white">
//                     <SelectValue placeholder="Location" />
//                   </SelectTrigger>
//                   <SelectContent className="bg-slate-800 border-white/20">
//                     {locations.map((location) => (
//                       <SelectItem
//                         key={location.value}
//                         value={location.value}
//                         className="text-white hover:bg-white/10"
//                       >
//                         {location.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </motion.div>

//             {/* Results */}
//             <p className="text-gray-300 mb-6">
//               Found{" "}
//               <span className="text-blue-400 font-semibold">
//                 {filteredTasks.length}
//               </span>{" "}
//               tasks
//             </p>

//             {/* Tasks Grid */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {filteredTasks.map((task, index) => {
//                 const CategoryIcon = getCategoryIcon(task.category);
//                 return (
//                   <motion.div
//                     key={task.id}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.5, delay: index * 0.1 }}
//                     whileHover={{ y: -5 }}
//                   >
//                     <Card className="glass-effect border-white/20 hover:border-blue-500/50 transition-all duration-300 h-full">
//                       <CardHeader>
//                         <div className="flex items-start justify-between">
//                           <div className="flex items-center space-x-3">
//                             <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
//                               <CategoryIcon className="w-5 h-5 text-white" />
//                             </div>
//                             <div>
//                               <CardTitle className="text-white text-lg">
//                                 {task.title}
//                               </CardTitle>
//                               <p className="text-gray-400 text-sm">
//                                 by {task.postedBy} • {task.postedTime}
//                               </p>
//                             </div>
//                           </div>
//                           <Badge
//                             className={`${getUrgencyColor(task.urgency)} border`}
//                           >
//                             {task.urgency}
//                           </Badge>
//                         </div>
//                       </CardHeader>

//                       <CardContent className="space-y-4">
//                         <p className="text-gray-300">{task.description}</p>

//                         <div className="flex flex-wrap gap-2">
//                           {task.skills.map((skill: string) => (
//                             <Badge
//                               key={skill}
//                               variant="outline"
//                               className="text-blue-400 border-blue-500/30"
//                             >
//                               {skill}
//                             </Badge>
//                           ))}
//                         </div>

//                         <div className="grid grid-cols-2 gap-4 text-sm">
//                           <div className="flex items-center space-x-2 text-gray-300">
//                             <MapPin className="w-4 h-4 text-blue-400" />
//                             <span>{task.location}</span>
//                           </div>
//                           <div className="flex items-center space-x-2 text-gray-300">
//                             <Clock className="w-4 h-4 text-green-400" />
//                             <span>{task.timeEstimate}</span>
//                           </div>
//                         </div>

//                         <div className="flex items-center justify-between pt-4 border-t border-white/10">
//                           <div className="flex items-center space-x-4">
//                             <div className="flex items-center space-x-1">
//                               <Star className="w-4 h-4 text-yellow-400 fill-current" />
//                               <span className="text-white font-semibold">
//                                 {task.rating}
//                               </span>
//                               <span className="text-gray-400">
//                                 ({task.reviews})
//                               </span>
//                             </div>
//                             <Badge className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border-yellow-500/30">
//                               {task.budget}{" "}
//                               <span className="core-token ml-1">CØRE</span>
//                             </Badge>
//                           </div>

//                           <Link href={`/task/${task.id}`}>
//                             <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
//                               View Details
//                             </Button>
//                           </Link>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   </motion.div>
//                 );
//               })}
//             </div>

//             {/* No Results */}
//             {filteredTasks.length === 0 && (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.6 }}
//                 className="text-center py-12"
//               >
//                 <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-500/20 to-gray-600/20 rounded-full flex items-center justify-center">
//                   <Search className="w-12 h-12 text-gray-400" />
//                 </div>
//                 <h3 className="text-xl font-semibold text-white mb-2">
//                   No tasks found
//                 </h3>
//                 <p className="text-gray-400 mb-6">
//                   Try adjusting your search criteria or check back later for new
//                   opportunities.
//                 </p>
//                 <Link href="/post-task">
//                   <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
//                     Post a Task Instead
//                   </Button>
//                 </Link>
//               </motion.div>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
